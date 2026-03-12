package com.facturestock.application.mapper;

import com.facturestock.application.dto.OperationItemResponse;
import com.facturestock.application.dto.OperationResponse;
import com.facturestock.domain.model.operation.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OperationMapper {

    private final ProductMapper productMapper;

    public OperationResponse toResponse(Operation domain) {
        if (domain == null)
            return null;

        return OperationResponse.builder()
                .id(domain.getId())
                .counterPartyName(domain.getCounterParty().getName())
                .type(domain.getType())
                .currentState(domain.getCurrentState())

                .items(domain.getItems().stream()
                        .map(item -> OperationItemResponse.builder()
                                .product(productMapper.toResponse(item.getProduct()))
                                .quantity(item.getQuantity())
                                .build())
                        .toList())
                .datePlanifiee(domain.getDatePlanifiee())
                .dateLimit(domain.getDateLimit())
                .build();
    }
}
