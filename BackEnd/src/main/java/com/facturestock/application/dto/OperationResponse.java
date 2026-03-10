package com.facturestock.application.dto;

import com.facturestock.domain.model.operation.OperationState;
import com.facturestock.domain.model.operation.OperationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationResponse {
    private Long id;
    private String beneficiaire;
    private OperationType type;
    private OperationState currentState;
    private List<OperationItemResponse> items;
    private LocalDate datePlanifiee;
    private LocalDate dateLimit;
}
