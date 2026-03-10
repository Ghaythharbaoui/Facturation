package com.facturestock.application.useCase;

import com.facturestock.application.dto.CreateOperationRequest;
import com.facturestock.domain.model.operation.Operation;

import java.util.List;

public interface OperationUseCase {
    Operation addOperation(CreateOperationRequest operation);

    List<Operation> getAllOperations();

    Operation getOperationById(Long id);

    void deleteOperationById(long id);

}
