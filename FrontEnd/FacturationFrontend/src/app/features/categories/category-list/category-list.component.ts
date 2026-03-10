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
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
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
