package com.noahgeerts.progress.service;

import org.springframework.stereotype.Service;

import com.noahgeerts.progress.repository.ExerciseRepository;

@Service
public class ExerciseService {
  private ExerciseRepository exerciseRepo;

  public ExerciseService(ExerciseRepository exerciseRepo) {
    this.exerciseRepo = exerciseRepo;
  }

}
