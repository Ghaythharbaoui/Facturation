package com.facturestock.presentation.controller;

import com.facturestock.application.dto.CreateOperationRequest;
import com.facturestock.application.dto.OperationResponse;
import com.facturestock.application.mapper.OperationMapper;
import com.facturestock.application.useCase.OperationUseCase;
import com.facturestock.domain.model.operation.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/operations")
@RequiredArgsConstructor
@Tag(name = "Operations", description = "Operation management APIs")
public class OperationController {

    private final OperationUseCase operationUseCase;
    private final OperationMapper operationMapper;

    @PostMapping
    public ResponseEntity<OperationResponse> addOperation(@Valid @RequestBody CreateOperationRequest request) {
        Operation operation = operationUseCase.addOperation(request);
        return new ResponseEntity<>(operationMapper.toResponse(operation), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OperationResponse>> getAllOperations() {
        List<Operation> operations = operationUseCase.getAllOperations();
        return new ResponseEntity<>(operations.stream().map(operationMapper::toResponse).toList(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OperationResponse> getOperationById(@PathVariable Long id) {
        Operation operation = operationUseCase.getOperationById(id);
        return new ResponseEntity<>(operationMapper.toResponse(operation), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOperationById(@PathVariable Long id) {
        operationUseCase.deleteOperationById(id);
        return ResponseEntity.noContent().build();
    }
}
