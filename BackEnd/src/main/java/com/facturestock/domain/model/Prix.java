package com.facturestock.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;

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
public class Prix {

    @EqualsAndHashCode.Include
    private Long id;
    private BigDecimal price;
    private LocalDate validUntil;
    private int minimumQuantity;
}
