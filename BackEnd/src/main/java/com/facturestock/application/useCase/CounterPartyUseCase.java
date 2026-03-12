package com.facturestock.application.useCase;

import com.facturestock.application.dto.CounterPartyResponse;
import com.facturestock.application.dto.CreateCounterPartyRequest;
import java.util.List;

public interface CounterPartyUseCase {
    CounterPartyResponse addCounterParty(CreateCounterPartyRequest request);
    List<CounterPartyResponse> getAllCounterParties();
    CounterPartyResponse getCounterPartyById(Long id);
    void deleteCounterPartyById(Long id);
}
