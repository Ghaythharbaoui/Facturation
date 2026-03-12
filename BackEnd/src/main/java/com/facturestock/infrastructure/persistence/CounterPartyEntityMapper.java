package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.counterparty.Contact;
import com.facturestock.domain.model.counterparty.CounterParty;
import org.springframework.stereotype.Component;

@Component
public class CounterPartyEntityMapper {

    public CounterParty toDomain(CounterPartyEntity entity) {
        if (entity == null) return null;

        return CounterParty.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nature(entity.getNature())
                .role(entity.getRole())
                .contact(Contact.builder()
                        .email(entity.getEmail())
                        .phone(entity.getPhone())
                        .address(entity.getAddress())
                        .build())
                .build();
    }

    public CounterPartyEntity toEntity(CounterParty domain) {
        if (domain == null) return null;

        CounterPartyEntity entity = CounterPartyEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .nature(domain.getNature())
                .role(domain.getRole())
                .build();

        if (domain.getContact() != null) {
            entity.setEmail(domain.getContact().getEmail());
            entity.setPhone(domain.getContact().getPhone());
            entity.setAddress(domain.getContact().getAddress());
        }

        return entity;
    }
}
