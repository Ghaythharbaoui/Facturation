package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.enums.ProductType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "for_sale")
    private boolean forSale;

    @Column(name = "for_purchase")
    private boolean forPurchase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductType type;

    @Column(name = "sale_tax", precision = 19, scale = 4)
    private BigDecimal saleTax;

    @Column(precision = 19, scale = 4)
    private BigDecimal cost;

    @Column(name = "purchase_tax", precision = 19, scale = 4)
    private BigDecimal purchaseTax;

    @ManyToMany
    @JoinTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    @Builder.Default
    private List<CategoryEntity> categories = new ArrayList<>();

    private String reference;

    @Column(name = "code_bar")
    private String codeBar;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PrixEntity> salePrices = new ArrayList<>();

    private int quantity;
}
