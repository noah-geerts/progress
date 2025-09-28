package com.noahgeerts.progress.domain.PerformedExercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePerformedExerciseDto {
  private Long eid;
}
