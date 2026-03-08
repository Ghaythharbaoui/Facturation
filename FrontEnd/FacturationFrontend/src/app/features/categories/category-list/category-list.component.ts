import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent],
  template: `
    <div class="fade-in">
      <!-- Search & Filters -->
      <div class="card mb-24">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="form-input"
              placeholder="Rechercher une catégorie..."
              [(ngModel)]="searchTerm"
              (input)="filterCategories()"
            />
          </div>
          <div class="filter-actions">
            <span class="text-muted text-sm">{{ filteredCategories().length }} catégorie(s)</span>
            <button class="btn btn-primary" (click)="openCreateDialog()">
              <span>+</span> Nouvelle Catégorie
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="card overflow-hidden">
        @if (loading()) {
          <div class="loading-overlay">
            <div class="spinner"></div>
          </div>
        } @else if (filteredCategories().length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon">🏷️</div>
            <div class="empty-state-title">Aucune catégorie</div>
            <p class="empty-state-text">
              {{ searchTerm ? 'Aucune catégorie ne correspond à votre recherche.' : 'Commencez par créer votre première catégorie pour organiser vos produits.' }}
            </p>
            @if (!searchTerm) {
              <button class="btn btn-primary mt-16" (click)="openCreateDialog()">Créer une catégorie</button>
            }
          </div>
        } @else {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 80px">ID</th>
                  <th>Nom de la catégorie</th>
                  <th style="width: 150px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (category of filteredCategories(); track category.id; let i = $index) {
                  <tr>
                    <td class="text-muted">#{{ category.id }}</td>
                    <td>
                      <div class="flex-items-center gap-12">
                        <div class="avatar-sm">{{ category.name.charAt(0).toUpperCase() }}</div>
                        <span class="font-medium text-primary-dark">{{ category.name }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="flex-justify-end gap-8">
                        <button class="btn-icon-sm" (click)="openEditDialog(category)" title="Modifier">✏️</button>
                        <button class="btn-icon-sm text-danger" (click)="confirmDelete(category)" title="Supprimer">🗑️</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Category Dialog -->
      @if (showDialog()) {
        <div class="modal-backdrop" (click)="closeDialog()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingCategory() ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h2>
              <button class="btn-ghost p-4" (click)="closeDialog()">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Nom de la catégorie *</label>
                <input
                  type="text"
                  class="form-input"
                  [class.is-invalid]="dialogSubmitted() && !dialogName().trim()"
                  placeholder="Ex: Électronique, Alimentaire..."
                  [ngModel]="dialogName()"
                  (ngModelChange)="dialogName.set($event)"
                  (keyup.enter)="saveCategory()"
                />
                @if (dialogSubmitted() && !dialogName().trim()) {
                  <span class="form-error">Le nom est obligatoire</span>
                }
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeDialog()">Annuler</button>
              <button class="btn btn-primary" (click)="saveCategory()" [disabled]="saving()">
                @if (saving()) { <div class="spinner-xs mr-8"></div> }
                {{ editingCategory() ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation -->
      @if (categoryToDelete()) {
        <app-confirm-dialog
          [title]="'Supprimer la catégorie'"
          [message]="'Êtes-vous sûr de vouloir supprimer la catégorie « ' + categoryToDelete()!.name + ' » ? Cette action est irréversible.'"
          (confirmed)="deleteCategory()"
          (cancelled)="categoryToDelete.set(null)"
        />
      }
    </div>
  `,
  styles: [`
    .mb-24 { margin-bottom: var(--space-24); }
    .mt-16 { margin-top: var(--space-16); }
    .mr-8 { margin-right: var(--space-8); }
    .p-4 { padding: var(--space-4); }
    .overflow-hidden { overflow: hidden; }
    
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-16);
      padding: var(--space-16) var(--space-24);
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: var(--space-16);
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      pointer-events: none;
    }

    .search-input-wrapper .form-input {
      padding-left: 38px;
    }

    .flex-items-center { display: flex; align-items: center; }
    .flex-justify-end { display: flex; justify-content: flex-end; }
    .gap-8 { gap: var(--space-8); }
    .gap-12 { gap: var(--space-12); }
    
    .avatar-sm {
      width: 32px;
      height: 32px;
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .btn-icon-sm {
      background: none;
      border: 1px solid var(--color-border);
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 14px;
    }

    .btn-icon-sm:hover {
      background-color: var(--color-bg-hover);
      border-color: var(--color-border-hover);
    }

    .text-primary-dark { color: var(--color-text-primary); }
    .text-muted { color: var(--color-text-muted); }
    .text-sm { font-size: var(--font-size-sm); }
    .font-medium { font-weight: 500; }
    .text-danger { color: var(--color-danger); }

    .spinner-xs {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  `]
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private toastService = inject(ToastService);

  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  loading = signal(true);
  searchTerm = '';

  // Dialog state
  showDialog = signal(false);
  editingCategory = signal<Category | null>(null);
  dialogName = signal('');
  dialogSubmitted = signal(false);
  saving = signal(false);

  // Delete state
  categoryToDelete = signal<Category | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.filterCategories();
        this.loading.set(false);
      },
      error: (err) => {
        this.toastService.error('Erreur lors du chargement des catégories');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  filterCategories(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCategories.set([...this.categories()]);
    } else {
      this.filteredCategories.set(
        this.categories().filter(c => c.name.toLowerCase().includes(term))
      );
    }
  }

  openCreateDialog(): void {
    this.editingCategory.set(null);
    this.dialogName.set('');
    this.dialogSubmitted.set(false);
    this.showDialog.set(true);
  }

  openEditDialog(category: Category): void {
    this.editingCategory.set(category);
    this.dialogName.set(category.name);
    this.dialogSubmitted.set(false);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingCategory.set(null);
  }

  saveCategory(): void {
    this.dialogSubmitted.set(true);

    const name = this.dialogName().trim();
    if (!name) return;

    this.saving.set(true);
    const request = { name };

    const editing = this.editingCategory();
    if (editing) {
      this.categoryService.updateCategory(editing.id, request).subscribe({
        next: () => {
          this.toastService.success('Catégorie mise à jour avec succès');
          this.closeDialog();
          this.saving.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.toastService.error('Erreur lors de la mise à jour');
          this.saving.set(false);
          console.error(err);
        }
      });
    } else {
      this.categoryService.createCategory(request).subscribe({
        next: () => {
          this.toastService.success('Catégorie créée avec succès');
          this.closeDialog();
          this.saving.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.toastService.error('Erreur lors de la création');
          this.saving.set(false);
          console.error(err);
        }
      });
    }
  }

  confirmDelete(category: Category): void {
    this.categoryToDelete.set(category);
  }

  deleteCategory(): void {
    const cat = this.categoryToDelete();
    if (!cat) return;

    this.categoryService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.toastService.success('Catégorie supprimée');
        this.categoryToDelete.set(null);
        this.loadCategories();
      },
      error: (err) => {
        this.toastService.error('Erreur lors de la suppression');
        this.categoryToDelete.set(null);
        console.error(err);
      }
    });
  }
}
