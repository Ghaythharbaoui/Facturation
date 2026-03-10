package com.facturestock.domain.model.operation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationFilter {

    private OperationState state;
    private int page;
    private int size;
    private String sortBy;
    private String sortDirection;

}
