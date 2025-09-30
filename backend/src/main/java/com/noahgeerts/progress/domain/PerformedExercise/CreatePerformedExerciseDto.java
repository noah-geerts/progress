package com.noahgeerts.progress.domain.PerformedExercise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePerformedExerciseDto {
  private Long eid;
  private Long ssid;
  private int position;
}
