package com.facturestock.domain.model;

import com.facturestock.domain.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilter {

    private String name;
    private ProductType type;
    private Boolean forSale;
    private Boolean forPurchase;
    private Long categoryId;
    private String reference;
    private int page;
    private int size;
    private String sortBy;
    private String sortDirection;
}
