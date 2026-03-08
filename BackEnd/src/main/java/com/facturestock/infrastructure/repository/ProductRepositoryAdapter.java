package com.facturestock.infrastructure.repository;

import com.facturestock.domain.model.PageResult;
import com.facturestock.domain.model.Product;
import com.facturestock.domain.model.ProductFilter;
import com.facturestock.domain.port.ProductRepositoryPort;
import com.facturestock.infrastructure.persistence.ProductEntity;
import com.facturestock.infrastructure.persistence.ProductEntityMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepositoryPort {

    private final JpaProductRepository jpaProductRepository;
    private final ProductEntityMapper mapper;

    @Override
    public Product save(Product product) {
        ProductEntity entity = mapper.toEntity(product);
        ProductEntity saved = jpaProductRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaProductRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return jpaProductRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaProductRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaProductRepository.existsById(id);
    }

    @Override
    public List<Product> findByNameContainingIgnoreCase(String name) {
        return jpaProductRepository.findByNameContainingIgnoreCase(name).stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Product> findByForSaleTrue() {
        return jpaProductRepository.findByForSaleTrue().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Product> findByForPurchaseTrue() {
        return jpaProductRepository.findByForPurchaseTrue().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public PageResult<Product> findAllFiltered(ProductFilter filter) {
        Sort sort = filter.getSortDirection().equalsIgnoreCase("desc")
                ? Sort.by(filter.getSortBy()).descending()
                : Sort.by(filter.getSortBy()).ascending();

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Specification<ProductEntity> spec = ProductSpecification.fromFilter(filter);

        Page<ProductEntity> page = jpaProductRepository.findAll(spec, pageable);

        List<Product> products = page.getContent().stream()
                .map(mapper::toDomain)
                .toList();

        return PageResult.<Product>builder()
                .content(products)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
