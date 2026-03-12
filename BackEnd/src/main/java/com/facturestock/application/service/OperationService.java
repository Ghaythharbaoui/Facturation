package com.facturestock.application.service;

import com.facturestock.application.dto.CreateOperationRequest;
import com.facturestock.application.useCase.OperationUseCase;
import com.facturestock.domain.model.Product;
import com.facturestock.domain.model.operation.Operation;
import com.facturestock.domain.model.operation.OperationItem;
import com.facturestock.domain.model.operation.OperationState;
import com.facturestock.domain.model.operation.OperationType;
import com.facturestock.domain.port.CounterPartyRepositoryPort;
import com.facturestock.domain.port.OperationRepository;
import com.facturestock.domain.port.ProductRepositoryPort;
import com.facturestock.domain.model.counterparty.CounterParty;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OperationService implements OperationUseCase {

        private final OperationRepository operationRepository;
        private final ProductRepositoryPort productRepository;
        private final CounterPartyRepositoryPort counterPartyRepository;

        @Override
        @Transactional
        public Operation addOperation(CreateOperationRequest request) {
                CounterParty counterParty = counterPartyRepository.findById(request.getConterPartyId())
                                .orElseThrow(() -> new RuntimeException(
                                                "CounterParty not found with ID: " + request.getConterPartyId()));

                List<OperationItem> items = request.getProductIds().entrySet().stream()
                                .map(entry -> {
                                        Product product = productRepository.findById(entry.getKey())
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Product not found with ID: "
                                                                                        + entry.getKey()));
                                        return OperationItem.builder()
                                                        .product(product)
                                                        .quantity(entry.getValue())
                                                        .build();
                                })
                                .toList();
                if (request.getConterPartyId() != null) {
                        counterParty = counterPartyRepository.findById(request.getConterPartyId())
                                        .orElseThrow(() -> new RuntimeException("CounterParty not found with ID: "
                                                        + request.getConterPartyId()));
                }
                Operation operation = Operation.builder()
                                .counterParty(counterParty)
                                .type(request.getType())
                                .items(items)
                                .datePlanifiee(request.getDatePlanifiee())
                                .dateLimit(request.getDateLimit())
                                .build();
                boolean allAvailable = items.stream()
                                .allMatch(item -> item.getProduct().isAvailable(item.getQuantity()));

                if (allAvailable) {
                        items.forEach(item -> {
                                Product product = item.getProduct();
                                switch (request.getType()) {
                                        case OperationType.LIVRAISON:
                                        case OperationType.RETOUR_FOURNISSEUR:
                                                product.decreaseStock(item.getQuantity());
                                                break;
                                        case OperationType.RECEPTION:
                                        case OperationType.RETOUR_CLIENT:
                                                product.increaseStock(item.getQuantity());
                                                break;
                                        default:
                                                break;
                                }
                                productRepository.save(product);
                        });
                        operation.setCurrentState(request.getState());
                } else {
                        operation.setCurrentState(OperationState.BROUILLON);
                }

                return operationRepository.save(operation);
        }

        @Override
        public List<Operation> getAllOperations() {
                return operationRepository.findAll();
        }

        @Override
        public Operation getOperationById(Long id) {
                return operationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Operation not found with ID: " + id));
        }

        @Override
        public void deleteOperationById(long id) {
                operationRepository.deleteById(id);
        }
}
