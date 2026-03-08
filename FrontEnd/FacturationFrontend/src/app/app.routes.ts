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
