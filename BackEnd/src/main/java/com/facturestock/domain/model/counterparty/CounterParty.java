package com.facturestock.domain.model.counterparty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounterParty {
    private Long id;
    private String name;
    private CounterPartyNature nature;
    private CounterPartyRole role;
    private Contact contact;
}
