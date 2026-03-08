package com.facturestock.infrastructure.repository;

import com.facturestock.domain.model.Category;
import com.facturestock.domain.port.CategoryRepositoryPort;
import com.facturestock.infrastructure.persistence.CategoryEntity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CategoryRepositoryAdapter implements CategoryRepositoryPort {

    private final JpaCategoryRepository jpaCategoryRepository;

    @Override
    public Category save(Category category) {
        CategoryEntity entity = toEntity(category);
        CategoryEntity saved = jpaCategoryRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return jpaCategoryRepository.findById(id)
                .map(this::toDomain);
    }

    @Override
    public List<Category> findAll() {
        return jpaCategoryRepository.findAll().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaCategoryRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaCategoryRepository.existsById(id);
    }

    private Category toDomain(CategoryEntity entity) {
        return Category.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }

    private CategoryEntity toEntity(Category category) {
        return CategoryEntity.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
}
