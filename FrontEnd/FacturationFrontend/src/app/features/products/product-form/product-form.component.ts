import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateProductRequest, UpdateProductRequest, ProductType } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `<div class="page-container">
  <!-- Header -->
  <div class="page-header">
    <div>
      <a routerLink="/products" class="back-link">← Retour aux produits</a>
      <h1>{{ isEditMode() ? 'Modifier le produit' : 'Nouveau produit' }}</h1>
      <p class="page-header-subtitle">
        {{ isEditMode() ? 'Modifiez les informations du produit' : 'Remplissez les informations pour créer un nouveau produit' }}
      </p>
    </div>
  </div>

  @if (loadingProduct()) {
    <div class="loading-overlay">
      <div class="spinner"></div>
    </div>
  } @else {
    <form (ngSubmit)="onSubmit()" #productForm="ngForm">
      <div class="form-grid">
        <!-- Left Column - Main Info -->
        <div class="form-column">
          <!-- Basic Info Card -->
          <div class="card form-card">
            <div class="form-card-header">
              <span class="form-card-icon">📋</span>
              <h2>Informations générales</h2>
            </div>
            <div class="form-card-body">
              <div class="form-group">
                <label class="form-label">Nom du produit *</label>
                <input
                  type="text"
                  class="form-input"
                  [class.is-invalid]="submitted() && !product.name?.trim()"
                  placeholder="Ex: MacBook Pro 14 pouces"
                  [(ngModel)]="product.name"
                  name="name"
                  required
                />
                @if (submitted() && !product.name?.trim()) {
                  <span class="form-error">Le nom est obligatoire</span>
                }
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Référence</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Ex: REF-001"
                    [(ngModel)]="product.reference"
                    name="reference"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Code-barres</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Ex: 3701234567890"
                    [(ngModel)]="product.codeBar"
                    name="codeBar"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Type de produit *</label>
                <select
                  class="form-select"
                  [(ngModel)]="product.type"
                  name="type"
                  required
                >
                  <option value="GOODS">Bien (Produit physique)</option>
                  <option value="SERVICE">Service</option>
                  <option value="COMBO">Combo (Pack)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea
                  class="form-textarea"
                  placeholder="Description détaillée du produit..."
                  [(ngModel)]="product.description"
                  name="description"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">URL de la photo</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="https://example.com/photo.jpg"
                  [(ngModel)]="product.photoUrl"
                  name="photoUrl"
                />
              </div>
            </div>
          </div>

          <!-- Pricing Card -->
          <div class="card form-card">
            <div class="form-card-header">
              <span class="form-card-icon">💰</span>
              <h2>Tarification</h2>
            </div>
            <div class="form-card-body">
                <div class="prices-container">
                  <div class="prices-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="form-label" style="margin: 0;">Liste des prix de vente (DT) *</span>
                    <button type="button" class="btn btn-secondary btn-sm" (click)="addPrice()" style="padding: 4px 8px; font-size: 12px;">+ Ajouter</button>
                  </div>
                  
                  @for (prix of product.salePrices; track $index) {
                    <div class="price-row" style="display: flex; gap: 8px; margin-bottom: 8px; align-items: flex-end;">
                      <div class="form-group" style="margin: 0; flex: 2;">
                        <label class="form-label" style="font-size: 11px;">Prix</label>
                        <input type="number" class="form-input" placeholder="0.00" [(ngModel)]="prix.price" [name]="'price_' + $index" step="0.01" min="0" />
                      </div>
                      <div class="form-group" style="margin: 0; flex: 1;">
                        <label class="form-label" style="font-size: 11px;">Qté Min</label>
                        <input type="number" class="form-input" [(ngModel)]="prix.minimumQuantity" [name]="'minQt_' + $index" min="1" />
                      </div>
                      @if (product.salePrices.length > 1) {
                        <button type="button" class="btn btn-secondary" (click)="removePrice($index)" style="padding: 8px 12px; color: var(--color-danger); background: transparent; border-color: rgba(239, 68, 68, 0.2);">🗑</button>
                      }
                    </div>
                  }
                </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">TVA Vente (%)</label>
                  <input
                    type="number"
                    class="form-input"
                    placeholder="19"
                    [(ngModel)]="product.saleTax"
                    name="saleTax"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Coût d'achat (DT)</label>
                  <input
                    type="number"
                    class="form-input"
                    placeholder="0.00"
                    [(ngModel)]="product.cost"
                    name="cost"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">TVA Achat (%)</label>
                  <input
                    type="number"
                    class="form-input"
                    placeholder="19"
                    [(ngModel)]="product.purchaseTax"
                    name="purchaseTax"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <!-- Pricing Summary -->
              @if (product.salePrices.length > 0 && product.salePrices[0] && product.salePrices[0].price > 0) {
                <div class="price-summary">
                  <div class="price-summary-row" style="margin-bottom: 8px; opacity: 0.8; font-size: 12px;">
                    <span>Résumé basé sur le 1er prix</span>
                  </div>
                  <div class="price-summary-row">
                    <span>Prix HT</span>
                    <span class="price-summary-value">{{ formatPrice(product.salePrices[0].price) }} DT</span>
                  </div>
                  <div class="price-summary-row">
                    <span>TVA ({{ product.saleTax || 0 }}%)</span>
                    <span class="price-summary-value">{{ formatPrice((product.salePrices[0].price || 0) * (product.saleTax || 0) / 100) }} DT</span>
                  </div>
                  <div class="price-summary-row total">
                    <span>Prix TTC</span>
                    <span class="price-summary-value">{{ formatPrice((product.salePrices[0].price || 0) * (1 + (product.saleTax || 0) / 100)) }} DT</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="form-column-side">
          <!-- Availability Card -->
          <div class="card form-card">
            <div class="form-card-header">
              <span class="form-card-icon">🔄</span>
              <h2>Disponibilité</h2>
            </div>
            <div class="form-card-body">
              <div class="toggle-wrapper" (click)="product.forSale = !product.forSale">
                <div class="toggle" [class.active]="product.forSale"></div>
                <div class="toggle-info">
                  <span class="toggle-label">Disponible à la vente</span>
                  <span class="toggle-desc">Ce produit peut être vendu aux clients</span>
                </div>
              </div>

              <div class="toggle-wrapper" (click)="product.forPurchase = !product.forPurchase" style="margin-top: 16px;">
                <div class="toggle" [class.active]="product.forPurchase"></div>
                <div class="toggle-info">
                  <span class="toggle-label">Disponible à l'achat</span>
                  <span class="toggle-desc">Ce produit peut être acheté aux fournisseurs</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Stock Card -->
          @if (product.type !== 'SERVICE') {
            <div class="card form-card">
              <div class="form-card-header">
                <span class="form-card-icon">📦</span>
                <h2>Stock</h2>
              </div>
              <div class="form-card-body">
                <div class="form-group">
                  <label class="form-label">Quantité en stock</label>
                  <div class="quantity-control" style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="btn-qty" (click)="decrementQuantity()" [disabled]="product.quantity <= 0" 
                      style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); background: white; border-radius: var(--radius-md); cursor: pointer; font-size: 18px;">−</button>
                    <input
                      type="number"
                      class="form-input"
                      style="text-align: center; width: 80px;"
                      placeholder="0"
                      [(ngModel)]="product.quantity"
                      name="quantity"
                      min="0"
                    />
                    <button type="button" class="btn-qty" (click)="incrementQuantity()"
                      style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); background: white; border-radius: var(--radius-md); cursor: pointer; font-size: 18px;">+</button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Categories Card -->
          <div class="card form-card">
            <div class="form-card-header">
              <span class="form-card-icon">🏷️</span>
              <h2>Catégories</h2>
              <button 
                type="button" 
                class="btn-add-category"
                (click)="openCategoryModal()"
              >
                + Ajouter
              </button>
            </div>
            <div class="form-card-body">
              @if (categories().length === 0) {
                <p class="no-categories-msg">Aucune catégorie disponible. 
                  <button type="button" class="link-btn" (click)="openCategoryModal()">Créer une catégorie</button>
                </p>
              } @else {
                <div class="category-checkboxes">
                  @for (cat of categories(); track cat.id) {
                    <label class="checkbox-item" [class.checked]="isCategorySelected(cat.id)">
                      <input
                        type="checkbox"
                        [checked]="isCategorySelected(cat.id)"
                        (change)="toggleCategory(cat.id)"
                      />
                      <span class="checkbox-mark"></span>
                      <span class="checkbox-label">{{ cat.name }}</span>
                      <button 
                        type="button" 
                        class="btn-remove-category"
                        (click)="removeCategory(cat.id)"
                        title="Supprimer la catégorie"
                      >
                        ×
                      </button>
                    </label>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary btn-full"
              [disabled]="saving()"
            >
              @if (saving()) {
                <div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
              }
              {{ isEditMode() ? 'Mettre à jour' : 'Créer le produit' }}
            </button>
            <a routerLink="/products" class="btn btn-secondary btn-full">Annuler</a>
          </div>
        </div>
      </div>
    </form>

    <!-- Category Modal -->
    @if (showCategoryModal()) {
      <div class="modal-backdrop" (click)="closeCategoryModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouvelle catégorie</h2>
            <button class="btn-ghost p-4" (click)="closeCategoryModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nom de la catégorie *</label>
              <input
                type="text"
                class="form-input"
                [class.is-invalid]="categoryFormSubmitted() && !newCategoryName().trim()"
                placeholder="Ex: Électronique, Alimentaire..."
                [ngModel]="newCategoryName()"
                (ngModelChange)="newCategoryName.set($event)"
                (keyup.enter)="addCategory()"
              />
              @if (categoryFormSubmitted() && !newCategoryName().trim()) {
                <span class="form-error">Le nom est obligatoire</span>
              }
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeCategoryModal()">Annuler</button>
            <button class="btn btn-primary" (click)="addCategory()" [disabled]="savingCategory()">
              @if (savingCategory()) { <div class="spinner-xs mr-8" style="width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px;"></div> }
              Ajouter
            </button>
          </div>
        </div>
      </div>
    }
  }
</div>
`,
  styles: `.page-container {
  animation: fadeIn var(--transition-base);
}

.back-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  display: inline-block;
  margin-bottom: var(--space-sm);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--color-accent);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-lg);
  align-items: start;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-card {
  margin-bottom: var(--space-lg);
}

.form-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.form-card-header h2 {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.form-card-icon {
  font-size: 1.2rem;
}

.form-card-body {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.toggle-info {
  display: flex;
  flex-direction: column;
}

.toggle-label {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-primary);
}

.toggle-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* Price Summary */
.price-summary {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.price-summary-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.price-summary-row.total {
  border-top: 1px solid var(--color-border);
  margin-top: 6px;
  padding-top: 10px;
  font-weight: 700;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.price-summary-value {
  font-variant-numeric: tabular-nums;
}

/* Category Checkboxes */
.category-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.checkbox-item:hover {
  background: var(--color-bg-hover);
}

.checkbox-item.checked {
  background: var(--color-accent-light);
}

.checkbox-item input[type="checkbox"] {
  display: none;
}

.checkbox-mark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-hover);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.checkbox-item.checked .checkbox-mark {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.checkbox-item.checked .checkbox-mark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.checkbox-item.checked .checkbox-label {
  color: var(--color-text-primary);
}

.no-categories-msg {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.no-categories-msg .link-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.btn-add-category {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-add-category:hover {
  background: var(--color-accent-dark);
}

.add-category-form {
  background: var(--color-bg-secondary);
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
}

.add-category-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: var(--font-size-xs);
}

.btn-remove-category {
  background: var(--color-danger);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  transition: all var(--transition-fast);
}

.btn-remove-category:hover {
  background: var(--color-danger-dark);
  transform: scale(1.1);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

/* Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-qty:hover:not(:disabled) {
  background: var(--color-bg-hover);
  border-color: var(--color-border-hover);
  color: var(--color-accent);
}

.btn-qty:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<{ id: number, name: string }[]>([]);
  isEditMode = signal(false);
  loadingProduct = signal(false);
  saving = signal(false);
  submitted = signal(false);
  newCategoryName = signal('');
  showCategoryModal = signal(false);
  categoryFormSubmitted = signal(false);
  savingCategory = signal(false);

  product: CreateProductRequest = {
    name: '',
    photoUrl: '',
    forSale: true,
    forPurchase: false,
    type: ProductType.GOODS,
    salePrices: [{ price: 0, minimumQuantity: 1 }],
    saleTax: 19,
    cost: 0,
    purchaseTax: 19,
    categoryIds: [],
    reference: '',
    codeBar: '',
    description: '',
    quantity: 0
  };

  private productId: number | null = null;

  ngOnInit(): void {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.isEditMode.set(true);
      this.loadProduct(this.productId);
    }
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.toastService.error('Erreur lors du chargement des catégories');
      }
    });
  }

  openCategoryModal(): void {
    this.newCategoryName.set('');
    this.categoryFormSubmitted.set(false);
    this.showCategoryModal.set(true);
  }

  closeCategoryModal(): void {
    this.showCategoryModal.set(false);
  }

  addCategory(): void {
    this.categoryFormSubmitted.set(true);
    const name = this.newCategoryName().trim();
    if (name) {
      this.savingCategory.set(true);
      this.categoryService.createCategory({ name }).subscribe({
        next: (created) => {
          this.categories.set([...this.categories(), created]);
          this.closeCategoryModal();
          this.savingCategory.set(false);
          this.toastService.success('Catégorie ajoutée avec succès');
        },
        error: (err) => {
          console.error('Error creating category', err);
          this.savingCategory.set(false);
          this.toastService.error('Erreur lors de la création de la catégorie');
        }
      });
    }
  }

  removeCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories.set(this.categories().filter(c => c.id !== id));

        // Remove from product if selected
        const idx = this.product.categoryIds.indexOf(id);
        if (idx >= 0) {
          this.product.categoryIds.splice(idx, 1);
        }

        this.toastService.success('Catégorie supprimée avec succès');
      },
      error: (err) => {
        console.error('Error deleting category', err);
        this.toastService.error('Erreur lors de la suppression de la catégorie');
      }
    });
  }

  private loadProduct(id: number): void {
    this.loadingProduct.set(true);
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.product = {
          name: p.name,
          photoUrl: p.photoUrl || '',
          forSale: p.forSale,
          forPurchase: p.forPurchase,
          type: p.type,
          salePrices: p.salePrices && p.salePrices.length > 0 ?
            p.salePrices.map(sp => ({ price: sp.price, validUntil: sp.validUntil, minimumQuantity: sp.minimumQuantity })) :
            [{ price: 0, minimumQuantity: 1 }],
          saleTax: p.saleTax,
          cost: p.cost,
          purchaseTax: p.purchaseTax,
          categoryIds: p.categories?.map(c => c.id) || [],
          reference: p.reference || '',
          codeBar: p.codeBar || '',
          description: p.description || '',
          quantity: p.quantity
        };
        this.loadingProduct.set(false);
      },
      error: (err) => {
        this.toastService.error('Erreur lors du chargement du produit');
        this.loadingProduct.set(false);
        console.error(err);
      }
    });
  }

  isCategorySelected(id: number): boolean {
    return this.product.categoryIds.includes(id);
  }

  toggleCategory(id: number): void {
    const idx = this.product.categoryIds.indexOf(id);
    if (idx >= 0) {
      this.product.categoryIds.splice(idx, 1);
    } else {
      this.product.categoryIds.push(id);
    }
  }

  formatPrice(value: number | undefined): string {
    if (value == null || isNaN(value)) return '0.00';
    return value.toFixed(2);
  }

  addPrice(): void {
    this.product.salePrices.push({ price: 0, minimumQuantity: 1 });
  }

  removePrice(index: number): void {
    if (this.product.salePrices.length > 1) {
      this.product.salePrices.splice(index, 1);
    }
  }

  incrementQuantity(): void {
    this.product.quantity = (this.product.quantity || 0) + 1;
  }

  decrementQuantity(): void {
    if (this.product.quantity > 0) {
      this.product.quantity = (this.product.quantity || 0) - 1;
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (!this.product.name?.trim()) {
      this.toastService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validate prices
    const invalidPrices = this.product.salePrices.some(p => p.price == null || p.price < 0 || p.minimumQuantity < 1);
    if (invalidPrices) {
      this.toastService.warning('Les prix et quantités minimales doivent être valides');
      return;
    }

    this.saving.set(true);

    if (this.isEditMode() && this.productId) {
      const selectedCategories = this.categories().filter(c => this.product.categoryIds.includes(c.id));
      const updateRequest: UpdateProductRequest = {
        name: this.product.name,
        photoUrl: this.product.photoUrl,
        forSale: this.product.forSale,
        forPurchase: this.product.forPurchase,
        type: this.product.type,
        saleTax: this.product.saleTax,
        cost: this.product.cost,
        purchaseTax: this.product.purchaseTax,
        categoryIds: this.product.categoryIds,
        categoryNames: selectedCategories.map(c => c.name),
        reference: this.product.reference,
        codeBar: this.product.codeBar,
        description: this.product.description,
        salePrices: this.product.salePrices,
        quantity: this.product.quantity
      };

      this.productService.updateProduct(this.productId, updateRequest).subscribe({
        next: () => {
          this.toastService.success('Produit mis à jour avec succès');
          this.saving.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.toastService.error('Erreur lors de la mise à jour');
          this.saving.set(false);
          console.error(err);
        }
      });
    } else {
      const selectedCategories = this.categories().filter(c => this.product.categoryIds.includes(c.id));
      const createRequest = {
        ...this.product,
        categoryNames: selectedCategories.map(c => c.name)
      };

      this.productService.createProduct(createRequest).subscribe({
        next: () => {
          this.toastService.success('Produit créé avec succès');
          this.saving.set(false);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          this.toastService.error('Erreur lors de la création');
          this.saving.set(false);
          console.error(err);
        }
      });
    }
  }
}
