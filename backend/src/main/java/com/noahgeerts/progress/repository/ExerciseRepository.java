package com.noahgeerts.progress.repository;

import org.springframework.data.repository.CrudRepository;

import com.noahgeerts.progress.domain.Exercise.Exercise;

public interface ExerciseRepository extends CrudRepository<Exercise, Long> {

}
