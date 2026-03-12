package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.operation.Operation;
import com.facturestock.domain.model.operation.OperationItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OperationEntityMapper {

    private final ProductEntityMapper productMapper;
    private final CounterPartyEntityMapper counterPartyMapper;

    public Operation toDomain(OperationEntity entity) {
        if (entity == null)
            return null;

        return Operation.builder()
                .id(entity.getId())
                .counterParty(counterPartyMapper.toDomain(entity.getCounterParty()))
                .type(entity.getType())
                .currentState(entity.getCurrentState())
                .items(entity.getItems().stream()
                        .map(item -> OperationItem.builder()
                                .product(productMapper.toDomain(item.getProduct()))
                                .quantity(item.getQuantity())
                                .build())
                        .toList())
                .datePlanifiee(entity.getDatePlanifiee())
                .dateLimit(entity.getDateLimit())
                .build();
    }

    public OperationEntity toEntity(Operation domain) {
        if (domain == null)
            return null;

        OperationEntity entity = OperationEntity.builder()
                .id(domain.getId())
                .counterParty(counterPartyMapper.toEntity(domain.getCounterParty()))
                .type(domain.getType())
                .currentState(domain.getCurrentState())
                .datePlanifiee(domain.getDatePlanifiee())
                .dateLimit(domain.getDateLimit())
                .build();

        if (domain.getItems() != null) {
            entity.setItems(domain.getItems().stream()
                    .map(item -> OperationItemEntity.builder()
                            .operation(entity)
                            .product(productMapper.toEntity(item.getProduct()))
                            .quantity(item.getQuantity())
                            .build())
                    .toList());
        }

        return entity;
    }
}
