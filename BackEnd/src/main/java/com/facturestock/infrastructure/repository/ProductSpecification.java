package com.facturestock.infrastructure.repository;

import com.facturestock.domain.model.ProductFilter;
import com.facturestock.infrastructure.persistence.ProductEntity;

import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<ProductEntity> fromFilter(ProductFilter filter) {
        return Specification
                .where(nameContains(filter.getName()))
                .and(typeEquals(filter.getType()))
                .and(forSaleEquals(filter.getForSale()))
                .and(forPurchaseEquals(filter.getForPurchase()))
                .and(hasCategoryId(filter.getCategoryId()))
                .and(referenceContains(filter.getReference()));
    }

    private static Specification<ProductEntity> nameContains(String name) {
        if (name == null || name.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<ProductEntity> typeEquals(
            com.facturestock.domain.enums.ProductType type) {
        if (type == null) return null;
        return (root, query, cb) -> cb.equal(root.get("type"), type);
    }

    private static Specification<ProductEntity> forSaleEquals(Boolean forSale) {
        if (forSale == null) return null;
        return (root, query, cb) -> cb.equal(root.get("forSale"), forSale);
    }

    private static Specification<ProductEntity> forPurchaseEquals(Boolean forPurchase) {
        if (forPurchase == null) return null;
        return (root, query, cb) -> cb.equal(root.get("forPurchase"), forPurchase);
    }

    private static Specification<ProductEntity> hasCategoryId(Long categoryId) {
        if (categoryId == null) return null;
        return (root, query, cb) -> {
            query.distinct(true);
            return cb.equal(root.join("categories", JoinType.INNER).get("id"), categoryId);
        };
    }

    private static Specification<ProductEntity> referenceContains(String reference) {
        if (reference == null || reference.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("reference")), "%" + reference.toLowerCase() + "%");
    }
}
