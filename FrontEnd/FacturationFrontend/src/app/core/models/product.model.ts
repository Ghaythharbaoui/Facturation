export enum ProductType {
    GOODS = 'GOODS',
    SERVICE = 'SERVICE',
    COMBO = 'COMBO'
}

export interface PrixResponse {
    id: number;
    price: number;
    validUntil: string;
    minimumQuantity: number;
}

export interface CategoryRef {
    id: number;
    name: string;
}

export interface CreatePrixRequest {
    price: number;
    validUntil?: string;
    minimumQuantity: number;
}

export interface Product {
    id: number;
    name: string;
    photoUrl: string;
    forSale: boolean;
    forPurchase: boolean;
    type: ProductType;
    saleTax: number;
    cost: number;
    purchaseTax: number;
    categories: CategoryRef[];
    reference: string;
    codeBar: string;
    description: string;
    salePrices: PrixResponse[];
    quantity: number;
}

export interface CreateProductRequest {
    name: string;
    photoUrl?: string;
    forSale: boolean;
    forPurchase: boolean;
    type: ProductType;
    saleTax: number;
    cost: number;
    purchaseTax: number;
    categoryIds: number[];
    reference?: string;
    codeBar?: string;
    description?: string;
    salePrices: CreatePrixRequest[];
    quantity: number;
}

export interface UpdateProductRequest {
    name: string;
    photoUrl?: string;
    forSale: boolean;
    forPurchase: boolean;
    type: ProductType;
    saleTax: number;
    cost: number;
    purchaseTax: number;
    categoryIds: number[];
    categoryNames?: string[];
    reference?: string;
    codeBar?: string;
    description?: string;
    salePrices: CreatePrixRequest[];
    quantity: number;
}

export interface ProductFilter {
    name?: string;
    type?: ProductType;
    forSale?: boolean;
    forPurchase?: boolean;
    categoryId?: number;
    reference?: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: string;
}
