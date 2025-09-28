package com.noahgeerts.progress.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Set {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private Long stid;

  @Column(nullable = false)
  private int order;
  @Column(nullable = false)
  private int reps;
  @Column(nullable = false)
  private double weight;

  @ManyToOne
  @JoinColumn(name = "peid")
  private PerformedExercise performedExercise;
}
