package com.facturestock.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CounterPartyJpaRepository extends JpaRepository<CounterPartyEntity, Long> {
}
