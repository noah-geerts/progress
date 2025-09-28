package com.noahgeerts.progress.repository;

import org.springframework.data.repository.CrudRepository;

import com.noahgeerts.progress.domain.PerformedExercise.PerformedExercise;

public interface PerformedExerciseRepository extends CrudRepository<PerformedExercise, Long> {

}
