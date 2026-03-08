package com.facturestock.application.useCase;

import com.facturestock.application.dto.CreateProductRequest;
import com.facturestock.application.dto.PageResponse;
import com.facturestock.application.dto.ProductFilterRequest;
import com.facturestock.application.dto.ProductResponse;
import com.facturestock.application.dto.UpdateProductRequest;

import java.util.List;

public interface ProductUseCase {

    ProductResponse createProduct(CreateProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    PageResponse<ProductResponse> getProductsFiltered(ProductFilterRequest filter);

    ProductResponse updateProduct(Long id, UpdateProductRequest request);

    void deleteProduct(Long id);

    List<ProductResponse> searchProducts(String name);

    List<ProductResponse> getProductsForSale();

    List<ProductResponse> getProductsForPurchase();
}
