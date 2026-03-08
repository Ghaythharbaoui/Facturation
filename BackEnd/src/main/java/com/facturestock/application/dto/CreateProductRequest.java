package com.facturestock.application.dto;

import java.math.BigDecimal;
import java.util.List;

import com.facturestock.domain.enums.ProductType;
import jakarta.validation.Valid;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String photoUrl;
    private boolean forSale;
    private boolean forPurchase;

    @NotNull(message = "Product type is required")
    private ProductType type;

    @Valid
    private List<CreatePrixRequest> salePrices;

    @PositiveOrZero(message = "Sale tax must be positive or zero")
    private BigDecimal saleTax;

    @PositiveOrZero(message = "Cost must be positive or zero")
    private BigDecimal cost;

    @PositiveOrZero(message = "Purchase tax must be positive or zero")
    private BigDecimal purchaseTax;

    private List<Long> categoryIds;
    private String reference;
    private String codeBar;
    private String description;

    @PositiveOrZero(message = "Quantity must be positive or zero")
    private int quantity;
}
