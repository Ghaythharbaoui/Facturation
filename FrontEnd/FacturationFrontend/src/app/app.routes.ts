import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadComponent: () =>
            import('./features/products/product-list/product-list.component')
                .then(m => m.ProductListComponent)
    },
    {
        path: 'products/new',
        loadComponent: () =>
            import('./features/products/product-form/product-form.component')
                .then(m => m.ProductFormComponent)
    },
    {
        path: 'products/:id/edit',
        loadComponent: () =>
            import('./features/products/product-form/product-form.component')
                .then(m => m.ProductFormComponent)
    },
    {
        path: 'categories',
        loadComponent: () =>
            import('./features/categories/category-list/category-list.component')
                .then(m => m.CategoryListComponent)
    },
    {
        path: 'operations',
        loadComponent: () =>
            import('./features/operations/operation-list/operation-list.component')
                .then(m => m.OperationListComponent)
    },
    {
        path: 'operations/new',
        loadComponent: () =>
            import('./features/operations/operation-form/operation-form.component')
                .then(m => m.OperationFormComponent)
    },
    {
        path: 'operations/:id',
        loadComponent: () =>
            import('./features/operations/operation-detail/operation-detail.component')
                .then(m => m.OperationDetailComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./features/products/product-list/product-list.component')
                .then(m => m.ProductListComponent)
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
