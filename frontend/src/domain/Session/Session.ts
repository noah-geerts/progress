import type { PerformedExerciseResponseDto } from "../PerformedExercise/PerformedExercise";

export interface SessionResponseDto {
  ssid: number;
  date: string; // LocalDate in Java becomes string in TypeScript
  name: string;
  performedExercises: PerformedExerciseResponseDto[];
}
