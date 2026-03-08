import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { ToastService } from '../../../core/services/toast.service';
import { CreateProductRequest, ProductType } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let activatedRoute: ActivatedRoute;

  const mockCategories: Category[] = [
    { id: 1, name: 'Électronique' },
    { id: 2, name: 'Informatique' }
  ];

  const mockProduct: CreateProductRequest = {
    name: 'Test Product',
    photoUrl: '',
    forSale: true,
    forPurchase: false,
    type: ProductType.GOODS,
    salePrices: [{ price: 100, minimumQuantity: 1 }],
    saleTax: 19,
    cost: 50,
    purchaseTax: 19,
    categoryIds: [1],
    reference: 'REF-001',
    codeBar: '123456789',
    description: 'Test description',
    quantity: 10
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProductById',
      'createProduct',
      'updateProduct'
    ]);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', [
      'getAllCategories'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'success',
      'error',
      'warning'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jasmine.createSpy('get')
              }
            }
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    categoryService.getAllCategories.and.returnValue(of(mockCategories));
    component.ngOnInit();
    expect(categoryService.getAllCategories).toHaveBeenCalled();
    expect(component.categories()).toEqual(mockCategories);
  });

  it('should load product when in edit mode', () => {
    (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
    productService.getProductById.and.returnValue(of(mockProduct));
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(component.isEditMode()).toBe(true);
    expect(component.productId).toBe(1);
    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product.name).toBe(mockProduct.name);
  });

  it('should handle product loading error', () => {
    (activatedRoute.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
    productService.getProductById.and.returnValue(throwError(() => new Error('Error')));
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    component.ngOnInit();

    expect(toastService.error).toHaveBeenCalledWith('Erreur lors du chargement du produit');
    expect(component.loadingProduct()).toBe(false);
  });

  it('should toggle category selection', () => {
    component.product.categoryIds = [1];
    
    // Remove category
    component.toggleCategory(1);
    expect(component.product.categoryIds).not.toContain(1);

    // Add category
    component.toggleCategory(2);
    expect(component.product.categoryIds).toContain(2);
  });

  it('should check if category is selected', () => {
    component.product.categoryIds = [1, 2];
    
    expect(component.isCategorySelected(1)).toBe(true);
    expect(component.isCategorySelected(3)).toBe(false);
  });

  it('should format price correctly', () => {
    expect(component.formatPrice(123.456)).toBe('123.46');
    expect(component.formatPrice(null as any)).toBe('0.00');
    expect(component.formatPrice(undefined)).toBe('0.00');
    expect(component.formatPrice(NaN)).toBe('0.00');
  });

  it('should add price', () => {
    const initialLength = component.product.salePrices.length;
    component.addPrice();
    expect(component.product.salePrices.length).toBe(initialLength + 1);
  });

  it('should remove price', () => {
    component.product.salePrices = [
      { price: 100, minimumQuantity: 1 },
      { price: 200, minimumQuantity: 5 }
    ];
    
    component.removePrice(0);
    expect(component.product.salePrices.length).toBe(1);
    expect(component.product.salePrices[0].price).toBe(200);
  });

  it('should not remove price if only one remains', () => {
    component.product.salePrices = [{ price: 100, minimumQuantity: 1 }];
    
    component.removePrice(0);
    expect(component.product.salePrices.length).toBe(1);
  });

  it('should validate form on submit', () => {
    component.product.name = '';
    component.onSubmit();
    
    expect(component.submitted()).toBe(true);
    expect(toastService.warning).toHaveBeenCalledWith('Veuillez remplir tous les champs obligatoires');
  });

  it('should validate prices on submit', () => {
    component.product.name = 'Test';
    component.product.salePrices = [{ price: -10, minimumQuantity: 0 }];
    
    component.onSubmit();
    
    expect(toastService.warning).toHaveBeenCalledWith('Les prix et quantités minimales doivent être valides');
  });

  it('should create product on submit in create mode', () => {
    component.product = mockProduct;
    productService.createProduct.and.returnValue(of({}));
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    component.onSubmit();

    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(toastService.success).toHaveBeenCalledWith('Produit créé avec succès');
  });

  it('should update product on submit in edit mode', () => {
    component.isEditMode.set(true);
    component.productId = 1;
    component.product = mockProduct;
    productService.updateProduct.and.returnValue(of({}));
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    component.onSubmit();

    expect(productService.updateProduct).toHaveBeenCalledWith(1, mockProduct);
    expect(toastService.success).toHaveBeenCalledWith('Produit mis à jour avec succès');
  });

  it('should handle create product error', () => {
    component.product = mockProduct;
    productService.createProduct.and.returnValue(throwError(() => new Error('Error')));
    categoryService.getAllCategories.and.returnValue(of(mockCategories));

    component.onSubmit();

    expect(toastService.error).toHaveBeenCalledWith('Erreur lors de la création');
    expect(component.saving()).toBe(false);
  });
});
