package com.noahgeerts.progress.domain.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSetDto {
  private Long peid;
  private int order;
  private int reps;
  private double weight;
}
