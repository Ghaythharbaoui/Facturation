export enum CounterPartyNature {
    INDIVIDUAL = 'INDIVIDUAL',
    COMPANY = 'COMPANY'
}

export enum CounterPartyRole {
    CLIENT = 'CLIENT',
    FOURNISSEUR = 'FOURNISSEUR'
}

export interface CounterParty {
    id: number;
    name: string;
    nature: CounterPartyNature;
    role: CounterPartyRole;
    email?: string;
    phone?: string;
    address?: string;
}

export interface CreateCounterPartyRequest {
    name: string;
    nature: CounterPartyNature;
    role: CounterPartyRole;
    email?: string;
    phone?: string;
    address?: string;
}
