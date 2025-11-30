import type { Exercise } from "../Exercise/Exercise";
import type { PerformedSet } from "../PerformedSet/PerformedSet";

export interface PerformedExercise {
  peid: number;
  position: number;
  exercise: Exercise;
  sets: PerformedSet[];
}
