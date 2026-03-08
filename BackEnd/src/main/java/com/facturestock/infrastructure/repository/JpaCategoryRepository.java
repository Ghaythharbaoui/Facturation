package com.facturestock.infrastructure.repository;

import com.facturestock.infrastructure.persistence.CategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
