package com.noahgeerts.progress.domain.PerformedSet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePerformedSetDto {
  private int reps;
  private double weight;
}
