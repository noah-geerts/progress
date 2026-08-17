import type { Exercise } from "../Exercise/Exercise";
import type { PerformedSet } from "../PerformedSet/PerformedSet";

export interface PerformedExercise {
  id: string;
  position: number;
  exercise: Exercise;
  sets: PerformedSet[];
}
