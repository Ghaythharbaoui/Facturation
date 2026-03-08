package com.facturestock.infrastructure.repository;

import com.facturestock.infrastructure.persistence.ProductEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface JpaProductRepository extends JpaRepository<ProductEntity, Long>,
        JpaSpecificationExecutor<ProductEntity> {

    List<ProductEntity> findByNameContainingIgnoreCase(String name);

    List<ProductEntity> findByForSaleTrue();

    List<ProductEntity> findByForPurchaseTrue();
}
