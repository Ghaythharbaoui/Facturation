package com.facturestock.application.mapper;

import com.facturestock.application.dto.CreateProductRequest;
import com.facturestock.application.dto.ProductResponse;
import com.facturestock.application.dto.UpdateProductRequest;
import com.facturestock.domain.model.Product;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = { CategoryMapper.class, PrixMapper.class })
public interface ProductMapper {

    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "salePrices", ignore = true)
    Product toDomain(CreateProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "salePrices", ignore = true)
    void updateDomainFromRequest(UpdateProductRequest request, @MappingTarget Product product);
}
