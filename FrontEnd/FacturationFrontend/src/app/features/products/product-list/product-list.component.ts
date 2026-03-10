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
  templateUrl: './product-list.component.html',
  styleUrl: './producr-list.component.css'
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
