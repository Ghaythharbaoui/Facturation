package com.facturestock.domain.model.ContreParty;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConterParty {
    private Long id;
    private String PhotoUrl;
    public conterPartyStatus status;
    private conterPartyType Type;
    private String Email;
    private String phoneNummber;
    private String adress;
    private String rue;
    private String ville;
    private String pays;
    private int codePostal;
    private String numerouTva;
    private String siteWeb;
    private List<contact> contacts;

}
