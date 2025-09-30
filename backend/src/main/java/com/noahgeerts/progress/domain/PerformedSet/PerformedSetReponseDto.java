package com.noahgeerts.progress.domain.PerformedSet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PerformedSetReponseDto {
  private Long stid;

  private int position;
  private int reps;
  private double weight;
}
