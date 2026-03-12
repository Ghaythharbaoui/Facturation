package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.counterparty.CounterPartyNature;
import com.facturestock.domain.model.counterparty.CounterPartyRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "counter_parties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounterPartyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CounterPartyNature nature;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CounterPartyRole role;

    private String email;
    private String phone;
    private String address;
}
