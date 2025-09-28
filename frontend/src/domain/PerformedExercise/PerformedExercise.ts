import type { ExerciseResponseDto } from "../Exercise/Exercise";
import type { SetReponseDto } from "../Set/Set";

export interface PerformedExerciseResponseDto {
  peid: number;
  order: number;
  exercise: ExerciseResponseDto;
  sets: SetReponseDto[];
}
