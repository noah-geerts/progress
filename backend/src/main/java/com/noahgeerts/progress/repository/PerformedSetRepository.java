package com.noahgeerts.progress.repository;

import org.springframework.data.repository.CrudRepository;

import com.noahgeerts.progress.domain.PerformedSet.PerformedSet;

public interface PerformedSetRepository extends CrudRepository<PerformedSet, Long> {

}
