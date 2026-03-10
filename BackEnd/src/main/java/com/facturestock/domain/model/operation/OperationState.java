package com.facturestock.domain.model.operation;

public enum OperationState {
    BROUILLON,
    PRET,
    TERMINE;

    public OperationState next() {
        return switch (this) {
            case BROUILLON -> PRET;
            case PRET -> TERMINE;
            case TERMINE -> TERMINE;
        };
    }
}
