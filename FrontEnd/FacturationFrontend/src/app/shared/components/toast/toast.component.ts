import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 420px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: var(--radius-lg);
      background: white;
      animation: slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: var(--shadow-lg);
    }
    .toast:hover {
      transform: translateX(-4px);
      box-shadow: var(--shadow-xl);
    }
    .toast-success {
      border-left: 4px solid var(--color-success);
    }
    .toast-success .toast-icon { color: var(--color-success); }
    .toast-error {
      border-left: 4px solid var(--color-danger);
    }
    .toast-error .toast-icon { color: var(--color-danger); }
    .toast-warning {
      border-left: 4px solid var(--color-warning);
    }
    .toast-warning .toast-icon { color: var(--color-warning); }
    .toast-info {
      border-left: 4px solid var(--color-primary);
    }
    .toast-info .toast-icon { color: var(--color-primary); }
    .toast-icon {
      font-size: 1.1rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .toast-message {
      flex: 1;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--color-text-primary);
    }
    .toast-close {
      background: none;
      border: none;
      color: var(--color-text-muted);
      opacity: 0.6;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 2px;
      transition: opacity 0.15s;
    }
    .toast-close:hover {
      opacity: 1;
    }
    @keyframes slideInRight {
      from { transform: translateX(24px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);
}
