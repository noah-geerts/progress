import type { PerformedExercise } from "../PerformedExercise/PerformedExercise";

export interface Session {
  ssid: number;
  date: string; // LocalDate in Java becomes string in TypeScript
  name: string;
  performedExercises: PerformedExercise[];
}
