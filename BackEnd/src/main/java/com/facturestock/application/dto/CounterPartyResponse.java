package com.facturestock.application.dto;

import com.facturestock.domain.model.counterparty.CounterPartyNature;
import com.facturestock.domain.model.counterparty.CounterPartyRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounterPartyResponse {
    private Long id;
    private String name;
    private CounterPartyNature nature;
    private CounterPartyRole role;
    private String email;
    private String phone;
    private String address;
}
