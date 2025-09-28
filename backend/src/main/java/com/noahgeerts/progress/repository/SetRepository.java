package com.noahgeerts.progress.repository;

import org.springframework.data.repository.CrudRepository;

import com.noahgeerts.progress.domain.Set.Set;

public interface SetRepository extends CrudRepository<Set, Long> {

}
