package com.noahgeerts.progress.domain.PerformedExercise;

import java.util.List;

import com.noahgeerts.progress.domain.Exercise.ExerciseResponseDto;
import com.noahgeerts.progress.domain.Set.SetReponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformedExerciseResponseDto {
  private Long peid;

  private int order;
  private ExerciseResponseDto exercise;
  private List<SetReponseDto> sets;
}
