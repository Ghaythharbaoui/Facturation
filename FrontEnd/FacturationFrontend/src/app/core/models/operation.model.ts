import { Product } from './product.model';
import { CounterParty } from './counter-party.model';

export enum OperationType {
    LIVRAISON = 'LIVRAISON',
    RECEPTION = 'RECEPTION',
    RETOUR_CLIENT = 'RETOUR_CLIENT',
    RETOUR_FOURNISSEUR = 'RETOUR_FOURNISSEUR',
    AJUSTEMENT_STOCK = 'AJUSTEMENT_STOCK'
}

export enum OperationState {
    BROUILLON = 'BROUILLON',
    PRET = 'PRET',
    TERMINE = 'TERMINE'
}

export interface OperationItem {
    product: Product;
    quantity: number;
}

export interface Operation {
    id: number;
    counterParty: CounterParty;
    type: OperationType;
    currentState: OperationState;
    items: OperationItem[];
    datePlanifiee: string;
    dateLimit: string;
}

export interface CreateOperationRequest {
    productIds: { [key: number]: number };
    type: OperationType;
    state: OperationState;
    datePlanifiee: string;
    dateLimit: string;
    counterPartyId: number;
}
