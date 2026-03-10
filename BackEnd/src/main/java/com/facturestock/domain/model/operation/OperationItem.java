package com.facturestock.domain.model.operation;

import com.facturestock.domain.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationItem {
    private Product product;
    private int quantity;
}
