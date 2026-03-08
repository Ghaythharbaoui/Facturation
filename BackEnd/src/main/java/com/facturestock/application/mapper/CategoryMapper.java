package com.facturestock.application.mapper;

import com.facturestock.application.dto.CategoryResponse;
import com.facturestock.domain.model.Category;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    Category toDomain(CategoryResponse response);
}
