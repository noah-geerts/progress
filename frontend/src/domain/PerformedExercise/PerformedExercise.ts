import type { ExerciseResponseDto } from "../Exercise/Exercise";
import type { SetReponseDto } from "../PerformedSet/PerformedSet";

export interface PerformedExerciseResponseDto {
  peid: number;
  position: number;
  exercise: ExerciseResponseDto;
  sets: SetReponseDto[];
}
