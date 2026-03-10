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
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
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
