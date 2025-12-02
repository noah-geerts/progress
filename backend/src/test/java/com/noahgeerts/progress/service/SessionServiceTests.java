package com.noahgeerts.progress.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import com.noahgeerts.progress.domain.Exercise.Exercise;
import com.noahgeerts.progress.domain.PerformedExercise.PerformedExercise;
import com.noahgeerts.progress.domain.PerformedSet.PerformedSet;
import com.noahgeerts.progress.domain.Session.Session;
import com.noahgeerts.progress.domain.Session.SessionRequestDto;
import com.noahgeerts.progress.domain.Session.SessionResponseDto;
import com.noahgeerts.progress.exceptions.ConflictException;
import com.noahgeerts.progress.exceptions.ResourceNotFoundException;
import com.noahgeerts.progress.repository.SessionRepository;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTests {

  @Mock
  private SessionRepository sessionRepo;

  private SessionService underTest;

  @BeforeEach
  void setup() {
    this.underTest = new SessionService(sessionRepo, new ModelMapper());
  }

  private static final Long TEST_SSID = 1L;
  private static final LocalDate TEST_SESSION_DATE = LocalDate.of(2004, 10, 04);
  private static final String TEST_SESSION_NAME = "Epic Session";
  private static final String TEST_UID = "uid";

  private Session createTestSession() {
    return Session.builder().ssid(TEST_SSID).date(TEST_SESSION_DATE).name(TEST_SESSION_NAME).uid(TEST_UID).build();
  }

  private Session createTestSessionWithUnorderedExercisesAndSets() {
    // Create exercises
    Exercise exercise1 = Exercise.builder().eid(1L).name("Bench Press").uid(TEST_UID).build();
    Exercise exercise2 = Exercise.builder().eid(2L).name("Squat").uid(TEST_UID).build();
    Exercise exercise3 = Exercise.builder().eid(3L).name("Deadlift").uid(TEST_UID).build();

    // Create sets for first exercise in wrong order (positions 2, 0, 1)
    PerformedSet set1_2 = PerformedSet.builder().stid(3L).position(2).reps(8).weight(100).uid(TEST_UID).build();
    PerformedSet set1_0 = PerformedSet.builder().stid(1L).position(0).reps(10).weight(80).uid(TEST_UID).build();
    PerformedSet set1_1 = PerformedSet.builder().stid(2L).position(1).reps(9).weight(90).uid(TEST_UID).build();
    List<PerformedSet> unorderedSets1 = Arrays.asList(set1_2, set1_0, set1_1);

    // Create performed exercises in wrong order (positions 2, 0, 1)
    PerformedExercise pe2 = PerformedExercise.builder()
        .peid(3L).position(2).exercise(exercise3).uid(TEST_UID).sets(Arrays.asList()).build();
    PerformedExercise pe0 = PerformedExercise.builder()
        .peid(1L).position(0).exercise(exercise1).uid(TEST_UID).sets(unorderedSets1).build();
    PerformedExercise pe1 = PerformedExercise.builder()
        .peid(2L).position(1).exercise(exercise2).uid(TEST_UID).sets(Arrays.asList()).build();

    List<PerformedExercise> unorderedExercises = Arrays.asList(pe2, pe0, pe1);

    return Session.builder()
        .ssid(TEST_SSID)
        .date(TEST_SESSION_DATE)
        .name(TEST_SESSION_NAME)
        .uid(TEST_UID)
        .performedExercises(unorderedExercises)
        .build();
  }

  @Nested
  class GetSession {
    @Test
    void shouldThrowNotFound_WhenNoSessionExistsOnThatDate() {
      // Arrange (session repo finds nothing)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.empty());

      // Act & Assert
      assertThatThrownBy(() -> underTest.getSession(TEST_UID, TEST_SESSION_DATE))
          .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldReturnRequestedSession_WhenSessionExists() {
      // Arrange (session repo finds a session)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.of(createTestSession()));

      // Act & Assert
      SessionResponseDto result = underTest.getSession(TEST_UID, TEST_SESSION_DATE);
      assertThat(result.getSsid()).isEqualTo(createTestSession().getSsid());
    }

    @Test
    void shouldReturnSessionWithSortedExercisesAndSets_WhenSessionExistsWithUnorderedData() {
      // Arrange - create session with exercises and sets in wrong order
      Session unorderedSession = createTestSessionWithUnorderedExercisesAndSets();
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.of(unorderedSession));

      // Act
      SessionResponseDto result = underTest.getSession(TEST_UID, TEST_SESSION_DATE);

      // Assert - verify exercises are sorted by position
      assertThat(result.getPerformedExercises()).hasSize(3);
      assertThat(result.getPerformedExercises().get(0).getPosition()).isEqualTo(0);
      assertThat(result.getPerformedExercises().get(1).getPosition()).isEqualTo(1);
      assertThat(result.getPerformedExercises().get(2).getPosition()).isEqualTo(2);

      // Assert - verify sets within each exercise are sorted by position
      assertThat(result.getPerformedExercises().get(0).getSets()).hasSize(3);
      assertThat(result.getPerformedExercises().get(0).getSets().get(0).getPosition()).isEqualTo(0);
      assertThat(result.getPerformedExercises().get(0).getSets().get(1).getPosition()).isEqualTo(1);
      assertThat(result.getPerformedExercises().get(0).getSets().get(2).getPosition()).isEqualTo(2);
    }
  }

  @Nested
  class CreateSession {
    @Test
    void shouldThrowConflict_WhenSessionAlreadyExistsOnThatDate() {
      // Arrange (session repo finds a session)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.of(createTestSession()));

      // Act & Assert
      SessionRequestDto dto = SessionRequestDto.builder().name(TEST_SESSION_NAME).build();
      assertThatThrownBy(() -> underTest.createSession(TEST_UID, TEST_SESSION_DATE, dto))
          .isInstanceOf(ConflictException.class);
    }

    @Test
    void shouldReturnNewSession_WhenSessionDoesNotAlreadyExists() {
      // Arrange (session repo finds nothing, save returns the new session)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.empty());
      Session input = createTestSession();
      input.setSsid(null);
      when(sessionRepo.save(input)).thenReturn(createTestSession());

      // Act & Assert
      SessionRequestDto dto = SessionRequestDto.builder().name(TEST_SESSION_NAME).build();
      SessionResponseDto result = underTest.createSession(TEST_UID, TEST_SESSION_DATE, dto);
      assertThat(result.getName()).isEqualTo(TEST_SESSION_NAME);
    }
  }

  @Nested
  class UpdateSession {
    @Test
    void shouldThrowNotFound_WhenSessionDoesntExistsForDate() {
      // Arrange (session repo finds nothing)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.empty());

      // Act & Assert
      SessionRequestDto dto = SessionRequestDto.builder().name(TEST_SESSION_NAME).build();
      assertThatThrownBy(() -> underTest.updateSession(TEST_UID, TEST_SESSION_DATE, dto))
          .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldUpdateSession_WhenItExistsForThatDate() {
      // Arrange (session repo finds a session, save is called)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.of(createTestSession()));
      when(sessionRepo.save(createTestSession())).thenReturn(createTestSession());

      // Act & Assert
      SessionRequestDto dto = SessionRequestDto.builder().name(TEST_SESSION_NAME).build();
      SessionResponseDto result = underTest.updateSession(TEST_UID, TEST_SESSION_DATE, dto);
      assertThat(result.getName()).isEqualTo(TEST_SESSION_NAME);
    }
  }

  @Nested
  class DeleteSession {
    @Test
    void shouldThrowNotFound_WhenSessionDoesntExistsForDate() {
      // Arrange (session repo finds nothing)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.empty());

      // Act & Assert
      assertThatThrownBy(() -> underTest.deleteSession(TEST_UID, TEST_SESSION_DATE))
          .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldDeleteSession_WhenItExistsForThatDate() {
      // Arrange (session repo finds a session)
      when(sessionRepo.findByDateAndUid(TEST_SESSION_DATE, TEST_UID)).thenReturn(Optional.of(createTestSession()));

      // Act & Assert
      underTest.deleteSession(TEST_UID, TEST_SESSION_DATE);
      verify(sessionRepo).delete(createTestSession());
    }
  }

}
