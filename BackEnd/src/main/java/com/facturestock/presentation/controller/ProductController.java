package com.facturestock.presentation.controller;

import com.facturestock.application.dto.CreateProductRequest;
import com.facturestock.application.dto.PageResponse;
import com.facturestock.application.dto.ProductFilterRequest;
import com.facturestock.application.dto.ProductResponse;
import com.facturestock.application.dto.UpdateProductRequest;
import com.facturestock.application.useCase.ProductUseCase;
import com.facturestock.domain.enums.ProductType;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductUseCase productUseCase;

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productUseCase.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productUseCase.getProductById(id));
    }

    @GetMapping
    @Operation(summary = "Get products with pagination and filters")
    public ResponseEntity<PageResponse<ProductResponse>> getProducts(
            @Parameter(description = "Filter by product name (partial match)")
            @RequestParam(required = false) String name,

            @Parameter(description = "Filter by product type")
            @RequestParam(required = false) ProductType type,

            @Parameter(description = "Filter by available for sale")
            @RequestParam(required = false) Boolean forSale,

            @Parameter(description = "Filter by available for purchase")
            @RequestParam(required = false) Boolean forPurchase,

            @Parameter(description = "Filter by category ID")
            @RequestParam(required = false) Long categoryId,

            @Parameter(description = "Filter by reference (partial match)")
            @RequestParam(required = false) String reference,

            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort field (e.g., name, salePrice, quantity)")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction: asc or desc")
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        ProductFilterRequest filter = ProductFilterRequest.builder()
                .name(name)
                .type(type)
                .forSale(forSale)
                .forPurchase(forPurchase)
                .categoryId(categoryId)
                .reference(reference)
                .page(page)
                .size(size)
                .sortBy(sortBy)
                .sortDirection(sortDirection)
                .build();

        return ResponseEntity.ok(productUseCase.getProductsFiltered(filter));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        return ResponseEntity.ok(productUseCase.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productUseCase.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productUseCase.searchProducts(name));
    }

    @GetMapping("/for-sale")
    @Operation(summary = "Get products available for sale")
    public ResponseEntity<List<ProductResponse>> getProductsForSale() {
        return ResponseEntity.ok(productUseCase.getProductsForSale());
    }

    @GetMapping("/for-purchase")
    @Operation(summary = "Get products available for purchase")
    public ResponseEntity<List<ProductResponse>> getProductsForPurchase() {
        return ResponseEntity.ok(productUseCase.getProductsForPurchase());
    }
}
