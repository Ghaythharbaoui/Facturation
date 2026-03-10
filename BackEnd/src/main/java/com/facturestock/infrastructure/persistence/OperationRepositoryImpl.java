package com.facturestock.infrastructure.persistence;

import com.facturestock.domain.model.PageResult;
import com.facturestock.domain.model.operation.Operation;
import com.facturestock.domain.model.operation.OperationFilter;
import com.facturestock.domain.port.OperationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class OperationRepositoryImpl implements OperationRepository {

    private final OperationJpaRepository jpaRepository;
    private final OperationEntityMapper mapper;

    @Override
    public Operation save(Operation operation) {
        OperationEntity entity = mapper.toEntity(operation);
        OperationEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Operation> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Operation> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public PageResult<Operation> findAllFiltered(OperationFilter filter) {
        PageRequest pageRequest = PageRequest.of(filter.getPage(), filter.getSize());
        // For now, simple pagination without filtering logic in JPA for brevity
        // In a real app, use Specifications or Querydsl
        Page<OperationEntity> page = jpaRepository.findAll(pageRequest);

        return PageResult.<Operation>builder()
                .content(page.getContent().stream().map(mapper::toDomain).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
