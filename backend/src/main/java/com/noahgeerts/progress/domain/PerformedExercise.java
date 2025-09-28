package com.noahgeerts.progress.domain;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformedExercise {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private Long peid;

  @Column(nullable = false)
  private int order;

  @ManyToOne
  @JoinColumn(name = "ssid")
  private Session session;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "eid")
  private Exercise exercise;

  @OneToMany(mappedBy = "peid", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  private List<Set> sets;
}
