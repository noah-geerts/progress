package com.noahgeerts.progress.domain.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SetReponseDto {
  private Long stid;

  private int order;
  private int reps;
  private double weight;
}
