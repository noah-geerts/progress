import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { AxiosError } from "axios";
import type { Exercise } from "../domain/Exercise/Exercise";
import type { ExerciseRequestDto } from "../domain/Exercise/ExerciseRequestDto";

export const useGetAllExercises = () => {
  // Consume auth and api contexts
  const { user } = useAuth0();
  const api = useApi();

  // Define query function
  const getAllExercises = () =>
    api.get<Exercise[]>("exercises").then((response) => response.data);

  // Return useQuery hook
  return useQuery<Exercise[], AxiosError>({
    queryKey: ["exercises", user?.sub],
    queryFn: getAllExercises,
  });
};

export const useCreateExercise = () => {
  // Consume auth, api, and query client contextx
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const createExercise = (body: ExerciseRequestDto) =>
    api.post<Exercise>("exercises", body).then((response) => response.data);

  // Return useMutation hook
  return useMutation<Exercise, AxiosError, ExerciseRequestDto>({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises", user?.sub],
      });
    },
  });
};

export const useUpdateExercise = (eid: number) => {
  // Consume auth, api, and query client contextx
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const updateExercise = (body: ExerciseRequestDto) =>
    api
      .patch<Exercise>("exercises/" + eid, body)
      .then((response) => response.data);

  // Return useMutation hook
  return useMutation<Exercise, AxiosError, ExerciseRequestDto>({
    mutationFn: updateExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises", user?.sub],
      });
    },
  });
};

export const useDeleteExercise = (eid: number) => {
  // Consume auth, api, and query client contextx
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const deleteExercise = () =>
    api.delete<void>("exercises/" + eid).then(() => {});

  // Return useMutation hook
  return useMutation<void, AxiosError>({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exercises", user?.sub],
      });
    },
  });
};
