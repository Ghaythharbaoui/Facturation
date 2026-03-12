package com.facturestock.presentation.controller;

import com.facturestock.application.dto.CounterPartyResponse;
import com.facturestock.application.dto.CreateCounterPartyRequest;
import com.facturestock.application.useCase.CounterPartyUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/counterparties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CounterPartyController {

    private final CounterPartyUseCase useCase;

    @PostMapping
    public ResponseEntity<CounterPartyResponse> addCounterParty(@RequestBody CreateCounterPartyRequest request) {
        return ResponseEntity.ok(useCase.addCounterParty(request));
    }

    @GetMapping
    public ResponseEntity<List<CounterPartyResponse>> getAllCounterParties() {
        return ResponseEntity.ok(useCase.getAllCounterParties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CounterPartyResponse> getCounterPartyById(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.getCounterPartyById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCounterPartyById(@PathVariable Long id) {
        useCase.deleteCounterPartyById(id);
        return ResponseEntity.noContent().build();
    }
}
