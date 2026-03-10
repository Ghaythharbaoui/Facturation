package com.facturestock.domain.model.operation;

import java.time.LocalDate;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Operation {
    private Long id;
    private String beneficiaire;
    private OperationType type;
    private OperationState currentState;
    private List<OperationItem> items;
    private LocalDate datePlanifiee;
    private LocalDate dateLimit;
}
