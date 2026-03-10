package com.facturestock.domain.port;

import java.util.List;
import java.util.Optional;

import com.facturestock.domain.model.PageResult;
import com.facturestock.domain.model.operation.Operation;
import com.facturestock.domain.model.operation.OperationFilter;

public interface OperationRepository {

    Operation save(Operation operation);

    Optional<Operation> findById(Long id);

    List<Operation> findAll();

    void deleteById(Long id);

    boolean existsById(Long id);

    PageResult<Operation> findAllFiltered(OperationFilter filter);
}
