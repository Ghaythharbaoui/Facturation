package com.facturestock.application.mapper;

import com.facturestock.application.dto.CreatePrixRequest;
import com.facturestock.application.dto.PrixResponse;
import com.facturestock.domain.model.Prix;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PrixMapper {

    PrixResponse toResponse(Prix prix);

    Prix toDomain(PrixResponse response);

    Prix toDomain(CreatePrixRequest request);
}
