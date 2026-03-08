package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.Category;
import com.facturestock.domain.model.Prix;
import com.facturestock.domain.model.Product;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductEntityMapper {

        public Product toDomain(ProductEntity entity) {
                if (entity == null)
                        return null;

                return Product.builder()
                                .id(entity.getId())
                                .name(entity.getName())
                                .photoUrl(entity.getPhotoUrl())
                                .forSale(entity.isForSale())
                                .forPurchase(entity.isForPurchase())
                                .type(entity.getType())
                                .saleTax(entity.getSaleTax())
                                .cost(entity.getCost())
                                .purchaseTax(entity.getPurchaseTax())
                                .reference(entity.getReference())
                                .codeBar(entity.getCodeBar())
                                .description(entity.getDescription())
                                .quantity(entity.getQuantity())
                                .categories(mapCategoriesToDomain(entity.getCategories()))
                                .salePrices(mapPrixToDomain(entity.getSalePrices()))
                                .build();
        }

        public ProductEntity toEntity(Product domain) {
                if (domain == null)
                        return null;

                ProductEntity entity = ProductEntity.builder()
                                .id(domain.getId())
                                .name(domain.getName())
                                .photoUrl(domain.getPhotoUrl())
                                .forSale(domain.isForSale())
                                .forPurchase(domain.isForPurchase())
                                .type(domain.getType())
                                .type(domain.getType())
                                .saleTax(domain.getSaleTax())
                                .cost(domain.getCost())
                                .purchaseTax(domain.getPurchaseTax())
                                .reference(domain.getReference())
                                .codeBar(domain.getCodeBar())
                                .description(domain.getDescription())
                                .quantity(domain.getQuantity())
                                .categories(new ArrayList<>())
                                .salePrices(new ArrayList<>())
                                .build();

                if (domain.getCategories() != null) {
                        entity.setCategories(mapCategoriesToEntity(domain.getCategories()));
                }

                if (domain.getSalePrices() != null) {
                        List<PrixEntity> prixEntities = mapPrixToEntity(domain.getSalePrices(), entity);
                        entity.setSalePrices(prixEntities);
                }

                return entity;
        }

        private List<Category> mapCategoriesToDomain(List<CategoryEntity> entities) {
                if (entities == null)
                        return new ArrayList<>();
                return entities.stream()
                                .map(e -> Category.builder()
                                                .id(e.getId())
                                                .name(e.getName())
                                                .build())
                                .toList();
        }

        private List<CategoryEntity> mapCategoriesToEntity(List<Category> categories) {
                if (categories == null)
                        return new ArrayList<>();
                return categories.stream()
                                .map(c -> CategoryEntity.builder()
                                                .id(c.getId())
                                                .name(c.getName())
                                                .build())
                                .toList();
        }

        private List<Prix> mapPrixToDomain(List<PrixEntity> entities) {
                if (entities == null)
                        return new ArrayList<>();
                return entities.stream()
                                .map(e -> Prix.builder()
                                                .id(e.getId())
                                                .price(e.getPrice())
                                                .validUntil(e.getValidUntil())
                                                .minimumQuantity(e.getMinimumQuantity())
                                                .build())
                                .toList();
        }

        private List<PrixEntity> mapPrixToEntity(List<Prix> prixList, ProductEntity product) {
                if (prixList == null)
                        return new ArrayList<>();
                return prixList.stream()
                                .map(p -> PrixEntity.builder()
                                                .id(p.getId())
                                                .price(p.getPrice())
                                                .validUntil(p.getValidUntil())
                                                .minimumQuantity(p.getMinimumQuantity())
                                                .product(product)
                                                .build())
                                .toList();
        }
}
