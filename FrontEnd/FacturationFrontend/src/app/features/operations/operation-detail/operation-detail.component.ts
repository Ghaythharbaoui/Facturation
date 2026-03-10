import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation.service';
import { Operation, OperationType, OperationState } from '../../../core/models/operation.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-operation-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './operation-detail.component.html',
    styleUrl: './operation-detail.component.css'
})
export class OperationDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private operationService = inject(OperationService);
    private toastService = inject(ToastService);

    operation = signal<Operation | null>(null);
    loading = signal(true);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOperation(Number(id));
        }
    }

    loadOperation(id: number): void {
        this.loading.set(true);
        this.operationService.getOperationById(id).subscribe({
            next: (data) => {
                this.operation.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading operation', err);
                this.toastService.error('Erreur lors du chargement de l’opération');
                this.loading.set(false);
            }
        });
    }

    getBadgeClass(type: OperationType): string {
        switch (type) {
            case OperationType.RECEPTION:
            case OperationType.RETOUR_CLIENT:
                return 'badge-success';
            case OperationType.LIVRAISON:
            case OperationType.RETOUR_FOURNISSEUR:
                return 'badge-warning';
            case OperationType.AJUSTEMENT_STOCK:
                return 'badge-info';
            default:
                return 'badge-secondary';
        }
    }

    getStateBadgeClass(state: OperationState): string {
        switch (state) {
            case OperationState.TERMINE:
                return 'badge-success';
            case OperationState.PRET:
                return 'badge-info';
            case OperationState.BROUILLON:
                return 'badge-warning';
            default:
                return 'badge-secondary';
        }
    }
}
