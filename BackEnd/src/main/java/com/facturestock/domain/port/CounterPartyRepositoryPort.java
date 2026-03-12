package com.facturestock.domain.port;

import com.facturestock.domain.model.counterparty.CounterParty;
import java.util.List;
import java.util.Optional;

public interface CounterPartyRepositoryPort {
    CounterParty save(CounterParty counterParty);
    Optional<CounterParty> findById(Long id);
    List<CounterParty> findAll();
    void deleteById(Long id);
}
