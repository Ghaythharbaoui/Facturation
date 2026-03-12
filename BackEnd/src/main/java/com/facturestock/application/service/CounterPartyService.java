package com.facturestock.application.service;

import com.facturestock.application.dto.CounterPartyResponse;
import com.facturestock.application.dto.CreateCounterPartyRequest;
import com.facturestock.application.mapper.CounterPartyMapper;
import com.facturestock.application.useCase.CounterPartyUseCase;
import com.facturestock.domain.model.counterparty.Contact;
import com.facturestock.domain.model.counterparty.CounterParty;
import com.facturestock.domain.port.CounterPartyRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CounterPartyService implements CounterPartyUseCase {

    private final CounterPartyRepositoryPort repository;
    private final CounterPartyMapper mapper;

    @Override
    public CounterPartyResponse addCounterParty(CreateCounterPartyRequest request) {
        CounterParty counterParty = CounterParty.builder()
                .name(request.getName())
                .nature(request.getNature())
                .role(request.getRole())
                .contact(Contact.builder()
                        .email(request.getEmail())
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .build())
                .build();
        
        return mapper.toResponse(repository.save(counterParty));
    }

    @Override
    public List<CounterPartyResponse> getAllCounterParties() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    public CounterPartyResponse getCounterPartyById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(() -> new RuntimeException("CounterParty not found with ID: " + id));
    }

    @Override
    public void deleteCounterPartyById(Long id) {
        repository.deleteById(id);
    }
}
