package com.facturestock.application.dto;

import java.time.LocalDate;
import java.util.HashMap;

import com.facturestock.domain.model.operation.OperationState;
import com.facturestock.domain.model.operation.OperationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOperationRequest {
    private HashMap<Long, Integer> productIds;
    private OperationType type;
    private OperationState state;
    private LocalDate datePlanifiee;
    private LocalDate dateLimit;
    private String beneficiaire;

}
