package com.facturestock.domain.port;

import com.facturestock.domain.model.PageResult;
import com.facturestock.domain.model.Product;
import com.facturestock.domain.model.ProductFilter;

import java.util.List;
import java.util.Optional;

public interface ProductRepositoryPort {

    Product save(Product product);

    Optional<Product> findById(Long id);

    List<Product> findAll();

    void deleteById(Long id);

    boolean existsById(Long id);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByForSaleTrue();

    List<Product> findByForPurchaseTrue();

    PageResult<Product> findAllFiltered(ProductFilter filter);
}
