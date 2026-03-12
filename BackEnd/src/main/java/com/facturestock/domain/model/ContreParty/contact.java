package com.facturestock.domain.model.ContreParty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class contact {
    private int id ;
    private String nom ; 
    private String prenom ; 
    private String email ; 
    private String phoneNummber ; 
}
