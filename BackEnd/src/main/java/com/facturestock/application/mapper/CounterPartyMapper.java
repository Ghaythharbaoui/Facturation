package com.facturestock.application.mapper;

import com.facturestock.application.dto.CounterPartyResponse;
import com.facturestock.domain.model.counterparty.CounterParty;
import org.springframework.stereotype.Component;

@Component
public class CounterPartyMapper {

    public CounterPartyResponse toResponse(CounterParty domain) {
        if (domain == null) return null;

        return CounterPartyResponse.builder()
                .id(domain.getId())
                .name(domain.getName())
                .nature(domain.getNature())
                .role(domain.getRole())
                .email(domain.getContact() != null ? domain.getContact().getEmail() : null)
                .phone(domain.getContact() != null ? domain.getContact().getPhone() : null)
                .address(domain.getContact() != null ? domain.getContact().getAddress() : null)
                .build();
    }
}
