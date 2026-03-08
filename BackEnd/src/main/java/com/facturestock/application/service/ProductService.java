package com.facturestock.application.service;

import com.facturestock.application.dto.CreateProductRequest;
import com.facturestock.application.dto.PageResponse;
import com.facturestock.application.dto.ProductFilterRequest;
import com.facturestock.application.dto.ProductResponse;
import com.facturestock.application.dto.UpdateProductRequest;
import com.facturestock.application.mapper.PrixMapper;
import com.facturestock.application.mapper.ProductMapper;
import com.facturestock.application.useCase.ProductUseCase;
import com.facturestock.domain.exception.ResourceNotFoundException;
import com.facturestock.domain.model.Category;
import com.facturestock.domain.model.PageResult;
import com.facturestock.domain.model.Product;
import com.facturestock.domain.model.ProductFilter;
import com.facturestock.domain.port.CategoryRepositoryPort;
import com.facturestock.domain.port.ProductRepositoryPort;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService implements ProductUseCase {

    private final ProductRepositoryPort productRepository;
    private final CategoryRepositoryPort categoryRepository;
    private final ProductMapper productMapper;
    private final PrixMapper prixMapper;

    @Override
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = productMapper.toDomain(request);
        
        // Handle salePrices manually to ensure proper mapping
        if (request.getSalePrices() != null) {
            product.setSalePrices(request.getSalePrices().stream()
                    .map(prixRequest -> prixMapper.toDomain(prixRequest))
                    .toList());
        }
        
        product.setCategories(resolveCategories(request.getCategoryIds(), null));
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProductsFiltered(ProductFilterRequest request) { 
        ProductFilter filter = ProductFilter.builder()
                .name(request.getName())
                .type(request.getType())
                .forSale(request.getForSale())
                .forPurchase(request.getForPurchase())
                .categoryId(request.getCategoryId())
                .reference(request.getReference())
                .page(request.getPage())
                .size(request.getSize())
                .sortBy(request.getSortBy())
                .sortDirection(request.getSortDirection())
                .build();

        PageResult<Product> result = productRepository.findAllFiltered(filter);

        List<ProductResponse> content = result.getContent().stream()
                .map(productMapper::toResponse)
                .toList();

        return PageResponse.<ProductResponse>builder()
                .content(content)
                .page(result.getPage())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .first(result.isFirst())
                .last(result.isLast())
                .build();
    }

    @Override
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));

        productMapper.updateDomainFromRequest(request, existing);
        
        // Handle salePrices manually to ensure proper collection update
        if (request.getSalePrices() != null) {
            existing.setSalePrices(request.getSalePrices().stream()
                    .map(prixRequest -> prixMapper.toDomain(prixRequest))
                    .toList());
        }
        
        existing.setCategories(resolveCategories(request.getCategoryIds(), request.getCategoryNames()));

        Product updated = productRepository.save(existing);
        return productMapper.toResponse(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsForSale() {
        return productRepository.findByForSaleTrue().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsForPurchase() {
        return productRepository.findByForPurchaseTrue().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    private List<Category> resolveCategories(List<Long> categoryIds, List<String> categoryNames) {
        List<Category> categories = new ArrayList<>();
        
        // Handle existing categories by ID
        if (categoryIds != null && !categoryIds.isEmpty()) {
            categories.addAll(categoryIds.stream()
                    .map(catId -> categoryRepository.findById(catId)
                            .orElseThrow(() -> new ResourceNotFoundException("Category", catId)))
                    .toList());
        }
        
        // Handle new categories by name
        if (categoryNames != null && !categoryNames.isEmpty()) {
            for (String categoryName : categoryNames) {
                // Check if category already exists in database by name
                boolean existsInDb = categoryRepository.findAll().stream()
                        .anyMatch(c -> c.getName().equals(categoryName));
                
                boolean existsInList = categories.stream().anyMatch(c -> c.getName().equals(categoryName));
                
                if (!existsInDb && !existsInList) {
                    // Create new category and save to database first
                    Category newCategory = Category.builder()
                            .name(categoryName)
                            .build();
                    Category saved = categoryRepository.save(newCategory);
                    categories.add(saved);
                }
            }
        }
        
        return categories;
    }
}
