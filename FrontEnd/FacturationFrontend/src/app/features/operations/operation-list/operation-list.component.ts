import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OperationService } from '../../../core/services/operation.service';
import { Operation, OperationType, OperationState } from '../../../core/models/operation.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-operation-list',
    standalone: true,
    imports: [RouterLink, CommonModule, ConfirmDialogComponent],
    templateUrl: './operation-list.component.html',
    styleUrl: './operation-list.component.css'
})
export class OperationListComponent implements OnInit {
    private operationService = inject(OperationService);
    private toastService = inject(ToastService);
    operations = signal<Operation[]>([]);
    loading = signal(false);
    operationToDelete = signal<Operation | null>(null);
    ngOnInit(): void {
        this.loadOperations();
    }

    loadOperations(): void {
        this.loading.set(true);
        this.operationService.getOperations().subscribe({
            next: (data) => {
                this.operations.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading operations', err);
                this.loading.set(false);
            }
        });
    }

    countByType(type: string): number {
        return this.operations().filter(op => op.type === type).length;
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

    confirmDelete(operation: Operation): void {
        this.operationToDelete.set(operation);
    }

    deleteOperarton(): void {
        const Operation = this.operationToDelete();
        if (!Operation) return;

        this.operationService.deletOperation(Operation.id).subscribe({
            next: () => {
                this.toastService.success('Operation supprimé');
                this.operationToDelete.set(null);
                this.loadOperations();
            },
            error: (err) => {
                this.toastService.error('Erreur lors de la suppression');
                this.operationToDelete.set(null);
                console.error(err);
            }
        });
    }
}
