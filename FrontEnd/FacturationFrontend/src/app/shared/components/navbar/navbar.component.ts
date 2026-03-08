import { Component, input } from '@angular/core';

@Component({
    selector: 'app-navbar',
    standalone: true,
    template: `
    <header class="navbar">
      <div class="navbar-left">
        <h2 class="page-title">{{ title() }}</h2>
      </div>
      <div class="navbar-right">
        <div class="navbar-actions">
          <button class="nav-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 14a2 2 0 1 0 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="nav-btn" title="Paramètres">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M16.167 10a6.167 6.167 0 0 0-.075-.95l2.075-1.625-2-3.464-2.458.917a6.124 6.124 0 0 0-1.642-.95L11.667.5H7.667l-.4 2.428a6.124 6.124 0 0 0-1.642.95L3.167 2.96l-2 3.464 2.075 1.625A6.29 6.29 0 0 0 3.167 9c0 .325.025.642.075.95L1.167 11.575l2 3.464 2.458-.917c.483.4 1.033.725 1.642.95l.4 2.428h4l.4-2.428a6.124 6.124 0 0 0 1.642-.95l2.458.917 2-3.464-2.075-1.625c.05-.308.075-.625.075-.95Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="divider"></div>
        <div class="user-profile">
          <div class="user-info">
            <span class="user-name">Ghayth Harbaoui</span>
            <span class="user-role">Administrateur</span>
          </div>
          <div class="user-avatar">GH</div>
        </div>
      </div>
    </header>
  `,
    styles: `
    .navbar {
      height: var(--navbar-height);
      background: white;
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-32);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .page-title {
      font-size: var(--font-size-md);
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-16);
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .nav-btn {
      background: none;
      border: none;
      color: var(--color-text-muted);
      padding: 8px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-btn:hover {
      background: var(--color-bg-hover);
      color: var(--color-text-primary);
    }

    .divider {
      width: 1px;
      height: 28px;
      background: var(--color-border);
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--space-12);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--color-text-primary);
      line-height: 1.3;
    }

    .user-role {
      font-size: 11px;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary-light), #C7D2FE);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--font-size-xs);
    }
  `
})
export class NavbarComponent {
    title = input<string>('FactureStock');
}
