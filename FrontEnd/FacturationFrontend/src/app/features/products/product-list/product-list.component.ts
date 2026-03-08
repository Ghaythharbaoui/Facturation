import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductFilter, ProductType } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { PageResponse } from '../../../core/models/page.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="fade-in">
      <!-- Stats Summary -->
      <div class="stats-grid mb-24">
        <div class="stat-card">
          <div class="stat-icon bg-primary-light text-primary">📦</div>
          <div class="stat-data">
            <span class="stat-label">Total Produits</span>
            <span class="stat-value">{{ pageData()?.totalElements ?? 0 }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-success-light text-success">🏷️</div>
          <div class="stat-data">
            <span class="stat-label">Biens</span>
            <span class="stat-value">{{ countByType('GOODS') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-info-light text-info">⚙️</div>
          <div class="stat-data">
            <span class="stat-label">Services</span>
            <span class="stat-value">{{ countByType('SERVICE') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-warning-light text-warning">📋</div>
          <div class="stat-data">
            <span class="stat-label">Combos</span>
            <span class="stat-value">{{ countByType('COMBO') }}</span>
          </div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="card mb-24">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="form-input"
              placeholder="Chercher par nom..."
              [(ngModel)]="filter.name"
              (input)="onSearchChange()"
            />
          </div>
          <div class="filter-group">
            <select class="form-select w-160" [(ngModel)]="filterType" (change)="onFilterChange()">
              <option value="">Tous les types</option>
              <option value="GOODS">📦 Biens</option>
              <option value="SERVICE">⚙️ Services</option>
              <option value="COMBO">📋 Combos</option>
            </select>
            <select class="form-select w-200" [(ngModel)]="filterCategoryId" (change)="onFilterChange()">
              <option value="">Toutes catégories</option>
              @for (cat of categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>
          <a routerLink="/products/new" class="btn btn-primary ml-auto">
            <span>+</span> Nouveau Produit
          </a>
        </div>
      </div>

      <!-- Products Table -->
      <div class="card overflow-hidden">
        @if (loading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
          </div>
        } @else if (products().length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon">📦</div>
            <div class="empty-state-title">Aucun produit trouvé</div>
            <p class="empty-state-text">
              {{ (filter.name || filterType || filterCategoryId) ? 'Aucun produit ne correspond à vos filtres.' : 'Commencez par ajouter votre premier produit au catalogue.' }}
            </p>
            @if (!(filter.name || filterType || filterCategoryId)) {
              <a routerLink="/products/new" class="btn btn-primary mt-16">Ajouter un produit</a>
            }
          </div>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th (click)="toggleSort('name')" class="cursor-pointer">
                    Produit {{ filter.sortBy === 'name' ? (filter.sortDirection === 'asc' ? '↑' : '↓') : '' }}
                  </th>
                  <th>Référence</th>
                  <th>Type</th>
                  <th class="financial">Prix vente</th>
                  <th class="cursor-pointer">Stock</th>
                  <th>Catégories</th>
                  <th style="width: 120px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of products(); track product.id; let i = $index) {
                  <tr>
                    <td>
                      <div class="product-item">
                        <div class="product-avatar">
                          @if (product.photoUrl) {
                            <img [src]="product.photoUrl" [alt]="product.name" />
                          } @else {
                            {{ product.name.charAt(0).toUpperCase() }}
                          }
                        </div>
                        <div class="product-meta">
                          <span class="product-name">{{ product.name }}</span>
                          <div class="tag-group">
                            @if (product.forSale) { <span class="mini-tag bg-success-light text-success">Vente</span> }
                            @if (product.forPurchase) { <span class="mini-tag bg-info-light text-info">Achat</span> }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><code class="ref-tag">{{ product.reference || '—' }}</code></td>
                    <td>
                      <span class="badge" [class]="'badge-' + (product.type === 'GOODS' ? 'success' : (product.type === 'SERVICE' ? 'info' : 'warning'))">
                        {{ product.type === 'GOODS' ? 'BIEN' : (product.type === 'SERVICE' ? 'SERVICE' : 'COMBO') }}
                      </span>
                    </td>
                    <td class="financial font-medium text-primary">
                      {{ formatPrice(product.salePrices && product.salePrices.length > 0 ? product.salePrices[0].price : 0) }} DT
                    </td>
                    <td>
                      <div class="stock-status">
                         <span class="stock-value" [class.text-danger]="product.quantity < 5 && product.type === 'GOODS'">
                          {{ product.type === 'SERVICE' ? '∞' : product.quantity }}
                        </span>
                        @if (product.quantity < 5 && product.type === 'GOODS') {
                          <span class="status-dot dot-danger" title="Stock faible"></span>
                        }
                      </div>
                    </td>
                    <td>
                      <div class="flex-wrap gap-4">
                        @for (cat of (product.categories || []).slice(0, 2); track cat.id) {
                          <span class="cat-pill">{{ cat.name }}</span>
                        }
                        @if ((product.categories?.length || 0) > 2) {
                          <span class="cat-more">+{{ product.categories!.length - 2 }}</span>
                        }
                      </div>
                    </td>
                    <td>
                      <div class="actions gap-8">
                        <a [routerLink]="['/products', product.id, 'edit']" class="btn-icon-sm" title="Modifier">✏️</a>
                        <button class="btn-icon-sm text-danger" (click)="confirmDelete(product)" title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          @if (pageData() && pageData()!.totalPages > 1) {
            <div class="pagination-bar">
              <span class="pagination-text">
                Affichage <b>{{ (filter.page * filter.size) + 1 }}–{{ Math.min((filter.page + 1) * filter.size, pageData()!.totalElements) }}</b> sur <b>{{ pageData()!.totalElements }}</b>
              </span>
              <div class="pagination-actions">
                <button class="btn-icon-sm" [disabled]="pageData()!.first" (click)="goToPage(filter.page - 1)">←</button>
                @for (p of getPageNumbers(); track p) {
                  <button class="page-num" [class.active]="p === filter.page" (click)="goToPage(p)">{{ p + 1 }}</button>
                }
                <button class="btn-icon-sm" [disabled]="pageData()!.last" (click)="goToPage(filter.page + 1)">→</button>
              </div>
            </div>
          }
        }
      </div>

      <!-- Delete Confirmation -->
      @if (productToDelete()) {
        <app-confirm-dialog
          [title]="'Supprimer le produit'"
          [message]="'Êtes-vous sûr de vouloir supprimer « ' + productToDelete()!.name + ' » ? Cette action est irréversible.'"
          (confirmed)="deleteProduct()"
          (cancelled)="productToDelete.set(null)"
        />
      }
    </div>
  `,
  styles: [`
    .mb-24 { margin-bottom: var(--space-24); }
    .mt-16 { margin-top: var(--space-16); }
    .ml-auto { margin-left: auto; }
    .w-160 { width: 160px; }
    .w-200 { width: 200px; }
    .overflow-hidden { overflow: hidden; }
    .cursor-pointer { cursor: pointer; }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--space-24);
    }
    .stat-card {
      background: white;
      padding: var(--space-24);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--space-16);
      box-shadow: var(--shadow-sm);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .stat-data { display: flex; flex-direction: column; }
    .stat-label { font-size: 12px; color: var(--color-text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.025em; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--color-text-primary); }

    .bg-primary-light { background-color: #EFF6FF; color: #2563EB; }
    .bg-success-light { background-color: #F0FDF4; color: #16A34A; }
    .bg-info-light { background-color: #F0F9FF; color: #0EA5E9; }
    .bg-warning-light { background-color: #FFFBEB; color: #D97706; }

    /* Filters */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: var(--space-16);
      padding: var(--space-16) var(--space-24);
    }
    .filter-group { display: flex; gap: var(--space-12); }
    .search-input-wrapper { position: relative; flex: 1; max-width: 320px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
    .search-input-wrapper .form-input { padding-left: 38px; }

    /* Table & Items */
    .product-item { display: flex; align-items: center; gap: 12px; }
    .product-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-bg-hover);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--color-text-muted);
      overflow: hidden;
    }
    .actions{
      display: flex ;
      gap: 10px ;
    }  
    .product-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .product-meta { display: flex; flex-direction: column; gap: 4px; }
    .product-name { font-weight: 600; color: var(--color-text-primary); }
    .tag-group { display: flex; gap: 4px; }
    .mini-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }

    .ref-tag {
      font-size: 12px;
      color: var(--color-text-muted);
      background: var(--color-bg-hover);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .stock-status { display: flex; align-items: center; gap: 8px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot-danger { background-color: var(--color-danger); box-shadow: 0 0 0 4px var(--color-danger-border); }

    .cat-pill {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 500;
    }
    .cat-more { font-size: 11px; color: var(--color-text-muted); }

    .btn-icon-sm {
      background: none;
      border: 1px solid var(--color-border);
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-secondary);
    }
    .btn-icon-sm:hover { border-color: var(--color-border-hover); background: var(--color-bg-hover); color: var(--color-text-primary); }

    .pagination-bar {
      padding: var(--space-16) var(--space-24);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-bg-main);
      border-top: 1px solid var(--color-border);
    }
    .pagination-text { font-size: 13px; color: var(--color-text-muted); }
    .pagination-actions { display: flex; align-items: center; gap: 4px; }
    .page-num {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      font-size: 13px;
      font-weight: 600;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .page-num:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .page-num.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
  `]
})
export class ProductListComponent implements OnInit {
  protected readonly Math = Math;

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  pageData = signal<PageResponse<Product> | null>(null);
  categories = signal<Category[]>([]);
  loading = signal(true);
  productToDelete = signal<Product | null>(null);

  filter: ProductFilter = {
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDirection: 'asc'
  };

  filterType = '';
  filterCategoryId = '';

  private searchTimeout: any;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading.set(true);

    const filterToSend: ProductFilter = { ...this.filter };
    if (this.filterType) {
      filterToSend.type = this.filterType as ProductType;
    }
    if (this.filterCategoryId) {
      filterToSend.categoryId = Number(this.filterCategoryId);
    }

    this.productService.getProducts(filterToSend).subscribe({
      next: (data) => {
        this.pageData.set(data);
        this.products.set(data.content);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Erreur lors du chargement des produits');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error(err)
    });
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filter.page = 0;
      this.loadProducts();
    }, 400);
  }

  onFilterChange(): void {
    this.filter.page = 0;
    this.loadProducts();
  }

  toggleSort(field: string): void {
    if (this.filter.sortBy === field) {
      this.filter.sortDirection = this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = field;
      this.filter.sortDirection = 'asc';
    }
    this.loadProducts();
  }

  goToPage(page: number): void {
    this.filter.page = page;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const total = this.pageData()?.totalPages ?? 0;
    const current = this.filter.page;
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatPrice(price: number | undefined): string {
    if (price == null || isNaN(price)) return '0.00';
    return price.toFixed(2);
  }

  countByType(type: string): number {
    return this.products().filter(p => p.type === type).length;
  }

  confirmDelete(product: Product): void {
    this.productToDelete.set(product);
  }

  deleteProduct(): void {
    const product = this.productToDelete();
    if (!product) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.toastService.success('Produit supprimé');
        this.productToDelete.set(null);
        this.loadProducts();
      },
      error: (err) => {
        this.toastService.error('Erreur lors de la suppression');
        this.productToDelete.set(null);
        console.error(err);
      }
    });
  }
}
