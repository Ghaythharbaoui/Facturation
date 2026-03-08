package com.facturestock.application.useCase;

import com.facturestock.application.dto.CategoryRequest;
import com.facturestock.application.dto.CategoryResponse;

import java.util.List;

public interface CategoryUseCase {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(Long id);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);
}
