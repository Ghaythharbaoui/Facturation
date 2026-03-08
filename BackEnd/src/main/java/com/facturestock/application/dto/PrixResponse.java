package com.facturestock.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrixResponse {

    private Long id;
    private BigDecimal price;
    private LocalDate validUntil;
    private int minimumQuantity;
}
