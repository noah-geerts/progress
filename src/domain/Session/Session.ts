import type { PerformedExercise } from "../PerformedExercise/PerformedExercise";

export interface Session {
  id: string;
  date: string; // LocalDate in Java becomes string in TypeScript
  name: string;
  performedExercises: PerformedExercise[];
}
