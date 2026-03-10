package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.operation.OperationState;
import com.facturestock.domain.model.operation.OperationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "operations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String beneficiaire;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_state", nullable = false)
    private OperationState currentState;

    @OneToMany(mappedBy = "operation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OperationItemEntity> items = new ArrayList<>();

    @Column(name = "date_planifiee")
    private LocalDate datePlanifiee;

    @Column(name = "date_limit")
    private LocalDate dateLimit;
}
