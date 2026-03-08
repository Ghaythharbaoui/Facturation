package com.facturestock.application.dto;

import java.math.BigDecimal;
import java.util.List;

import com.facturestock.domain.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String photoUrl;
    private boolean forSale;
    private boolean forPurchase;
    private ProductType type;
    private BigDecimal saleTax;
    private BigDecimal cost;
    private BigDecimal purchaseTax;
    private List<CategoryResponse> categories;
    private String reference;
    private String codeBar;
    private String description;
    private List<PrixResponse> salePrices;
    private int quantity;
}
