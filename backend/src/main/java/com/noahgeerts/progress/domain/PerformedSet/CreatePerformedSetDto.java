package com.noahgeerts.progress.domain.PerformedSet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePerformedSetDto {
  private Long peid;
  private Integer position;
  private Integer reps;
  private Double weight;
}
