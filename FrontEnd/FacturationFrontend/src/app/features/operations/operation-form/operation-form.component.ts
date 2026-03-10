import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateOperationRequest, OperationType, OperationState } from '../../../core/models/operation.model';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-operation-form',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './operation-form.component.html',
    styleUrl: './operation-form.component.css'
})
export class OperationFormComponent implements OnInit {
    private operationService = inject(OperationService);
    private productService = inject(ProductService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    saving = signal(false);
    searchResults = signal<Product[]>([]);
    selectedItems = signal<{ product: Product, quantity: number }[]>([]);

    request: CreateOperationRequest = {
        productIds: {},
        type: OperationType.RECEPTION,
        state: OperationState.BROUILLON,
        datePlanifiee: new Date().toISOString().split('T')[0],
        dateLimit: '',
        beneficiaire: ''
    };

    private searchTimeout: any;

    ngOnInit(): void {
    }

    onSearchProduct(event: any): void {
        const query = event.target.value;
        clearTimeout(this.searchTimeout);

        if (!query || query.length < 2) {
            this.searchResults.set([]);
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.productService.searchProducts(query).subscribe({
                next: (products) => this.searchResults.set(products),
                error: (err) => console.error('Error searching products', err)
            });
        }, 300);
    }

    addProduct(product: Product): void {
        const existing = this.selectedItems().find(item => item.product.id === product.id);
        if (!existing) {
            this.selectedItems.set([...this.selectedItems(), { product, quantity: 1 }]);
        } else {
            this.toastService.info(`${product.name} est déjà dans la liste`);
        }
        this.searchResults.set([]);
        this.updateProductIdsMap();
    }

    removeItem(index: number): void {
        const items = [...this.selectedItems()];
        items.splice(index, 1);
        this.selectedItems.set(items);
        this.updateProductIdsMap();
    }

    updateProductIdsMap(): void {
        const productIds: { [key: number]: number } = {};
        this.selectedItems().forEach(item => {
            productIds[item.product.id] = item.quantity;
        });
        this.request.productIds = productIds;
    }

    onSubmit(): void {
        if (this.selectedItems().length === 0) {
            this.toastService.warning('Veuillez ajouter au moins un produit');
            return;
        }

        this.updateProductIdsMap();
        this.saving.set(true);

        this.operationService.addOperation(this.request).subscribe({
            next: (res) => {
                this.toastService.success('Opération enregistrée avec succès');
                this.saving.set(false);
                this.router.navigate(['/operations']);
            },
            error: (err) => {
                console.error('Error adding operation', err);
                this.toastService.error('Erreur lors de l’enregistrement de l’opération');
                this.saving.set(false);
            }
        });
    }
}
