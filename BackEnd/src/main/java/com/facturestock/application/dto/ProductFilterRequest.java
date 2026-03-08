package com.facturestock.application.dto;

import com.facturestock.domain.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterRequest {

    private String name;
    private ProductType type;
    private Boolean forSale;
    private Boolean forPurchase;
    private Long categoryId;
    private String reference;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    @Builder.Default
    private String sortBy = "id";

    @Builder.Default
    private String sortDirection = "asc";
}
