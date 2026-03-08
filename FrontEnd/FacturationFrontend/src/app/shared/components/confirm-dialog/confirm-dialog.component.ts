import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ title() }}</h2>
          <button class="btn btn-ghost btn-icon" (click)="onCancel()">✕</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ message() }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onCancel()">Annuler</button>
          <button class="btn btn-danger" (click)="onConfirm()">{{ confirmText() }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-24);
      border-bottom: 1px solid var(--color-border);
    }
    .modal-header h2 {
      font-size: var(--font-size-md);
      font-weight: 700;
      color: var(--color-text-primary);
    }
    .modal-body {
      padding: var(--space-24);
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-12);
      padding: var(--space-16) var(--space-24);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-main);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }
    .confirm-message {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: 1.7;
    }
    .btn-icon {
      background: none;
      border: none;
      padding: var(--space-4);
      cursor: pointer;
      color: var(--color-text-muted);
      font-size: 1rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .btn-icon:hover { background: var(--color-bg-hover); }
  `]
})
export class ConfirmDialogComponent {
  title = input<string>('Confirmer la suppression');
  message = input<string>('Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.');
  confirmText = input<string>('Supprimer');

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
