package com.facturestock.domain.model;

import java.math.BigDecimal;
import java.util.List;

import com.facturestock.domain.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Product {

    @EqualsAndHashCode.Include
    private Long id;

    private String name;
    private String photoUrl;
    private boolean forSale;
    private boolean forPurchase;
    private ProductType type;
    private BigDecimal saleTax;
    private BigDecimal cost;
    private BigDecimal purchaseTax;
    private List<Category> categories;
    private String reference;
    private String codeBar;
    private String description;
    private List<Prix> salePrices;
    private int quantity;

    public boolean isAvailable(int demande) {
        return demande <= this.quantity;
    }

    public void decreaseStock(int amount) {
        if (this.quantity < amount) {
            throw new IllegalStateException("Not enough stock for product " + name);
        }
        this.quantity -= amount;
    }

    public void increaseStock(int amount) {
        this.quantity += amount;
    }
}
