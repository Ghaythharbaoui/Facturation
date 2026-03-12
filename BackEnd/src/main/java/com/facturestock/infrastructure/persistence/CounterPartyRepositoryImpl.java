package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.counterparty.CounterParty;
import com.facturestock.domain.port.CounterPartyRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CounterPartyRepositoryImpl implements CounterPartyRepositoryPort {

    private final CounterPartyJpaRepository jpaRepository;
    private final CounterPartyEntityMapper mapper;

    @Override
    public CounterParty save(CounterParty counterParty) {
        CounterPartyEntity entity = mapper.toEntity(counterParty);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<CounterParty> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<CounterParty> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
