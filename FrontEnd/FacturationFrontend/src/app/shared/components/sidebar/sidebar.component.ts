import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo-box"><span class="logo-f">F</span></div>
        @if (!collapsed()) {
          <div class="logo-text">
            <h1>FactureStock</h1>
            <p>ERP Pro</p>
          </div>
        }
        <button class="sidebar-toggle" (click)="toggleSidebar()" [title]="collapsed() ? 'Ouvrir' : 'Réduire'">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            @if (collapsed()) {
              <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            } @else {
              <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            }
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          @if (!collapsed()) { <div class="nav-label">Principal</div> }
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Tableau de bord' : ''">
            <span class="nav-icon">📊</span>
            @if (!collapsed()) { <span>Tableau de bord</span> }
          </a>
        </div>

        <div class="nav-section">
          @if (!collapsed()) { <div class="nav-label">Catalogue</div> }
          <a routerLink="/products" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Produits' : ''">
            <span class="nav-icon">📦</span>
            @if (!collapsed()) { <span>Produits</span> }
          </a>
          <a routerLink="/categories" routerLinkActive="active" class="nav-item" [title]="collapsed() ? 'Catégories' : ''">
            <span class="nav-icon">🏷️</span>
            @if (!collapsed()) { <span>Catégories</span> }
          </a>
        </div>

        <div class="nav-section">
          @if (!collapsed()) { <div class="nav-label">Opérations</div> }
          <a class="nav-item disabled" title="Bientôt disponible">
            <span class="nav-icon">🧾</span>
            @if (!collapsed()) { <span>Factures</span> <span class="coming-soon">Bientôt</span> }
          </a>
          <a class="nav-item disabled" title="Bientôt disponible">
            <span class="nav-icon">👥</span>
            @if (!collapsed()) { <span>Clients</span> <span class="coming-soon">Bientôt</span> }
          </a>
          <a class="nav-item disabled" title="Bientôt disponible">
            <span class="nav-icon">🏭</span>
            @if (!collapsed()) { <span>Stock</span> <span class="coming-soon">Bientôt</span> }
          </a>
        </div>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <a class="nav-item" title="Paramètres">
          <span class="nav-icon">⚙️</span>
          @if (!collapsed()) { <span>Paramètres</span> }
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--color-bg-sidebar);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: width var(--transition-base);
      overflow: hidden;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed-width); }

    /* Header */
    .sidebar-header {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      gap: var(--space-12);
      padding: 0 var(--space-16);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }
    .logo-box {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .logo-f { color: white; font-weight: 800; font-size: 1.15rem; }
    .logo-text h1 {
      font-size: var(--font-size-sm);
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: 1.2;
    }
    .logo-text p {
      font-size: 10px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }

    /* Toggle */
    .sidebar-toggle {
      margin-left: auto;
      width: 28px;
      height: 28px;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-muted);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }
    .sidebar-toggle:hover {
      background: var(--color-primary-light);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    /* Nav */
    .sidebar-nav {
      flex: 1;
      padding: var(--space-12) var(--space-8);
      overflow-y: auto;
    }
    .nav-section { margin-bottom: var(--space-24); }
    .nav-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-text-muted);
      letter-spacing: 0.06em;
      padding: 0 var(--space-12);
      margin-bottom: var(--space-8);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-12);
      padding: 9px var(--space-12);
      border-radius: var(--radius-md);
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--font-size-sm);
      font-weight: 500;
      margin-bottom: 2px;
      transition: all var(--transition-fast);
      white-space: nowrap;
      cursor: pointer;
    }
    .nav-item:hover:not(.disabled) {
      background: var(--color-bg-hover);
      color: var(--color-text-primary);
    }
    .nav-item.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 600;
    }
    .nav-item.disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .nav-icon {
      font-size: 1.15rem;
      width: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .coming-soon {
      margin-left: auto;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-muted);
      background: var(--color-bg-hover);
      padding: 2px 6px;
      border-radius: var(--radius-xs);
    }

    /* Footer */
    .sidebar-footer {
      padding: var(--space-12) var(--space-8);
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class SidebarComponent {
  collapsed = signal(false);

  toggleSidebar(): void {
    this.collapsed.update(v => !v);
  }
}
