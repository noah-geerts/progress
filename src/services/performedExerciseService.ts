import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { AxiosError } from "axios";
import type { PerformedExercise } from "../domain/PerformedExercise/PerformedExercise";
import type { CreatePerformedExerciseDto } from "../domain/PerformedExercise/CreatePerformedExerciseDto";
import type { UpdatePerformedExerciseDto } from "../domain/PerformedExercise/UpdatePerformedExerciseDto";

export const useCreatePE = (sessionLocalDate: string) => {
  // Use auth, api, and query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const createPE = (body: CreatePerformedExerciseDto) =>
    api
      .post<PerformedExercise>("performed-exercises", body)
      .then((response) => response.data);

  // Return useMutation hook
  return useMutation<PerformedExercise, AxiosError, CreatePerformedExerciseDto>(
    {
      mutationFn: createPE,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sessions", user?.sub, sessionLocalDate],
        });
      },
    }
  );
};

export const useUpdatePE = (id: string, sessionLocalDate: string) => {
  // Consume api, auth, and queryClient contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const updatePE = (body: UpdatePerformedExerciseDto) =>
    api
      .patch<PerformedExercise>("performed-exercises/" + id, body)
      .then((response) => response.data);

  // Return useMutation hook
  return useMutation<PerformedExercise, AxiosError, UpdatePerformedExerciseDto>(
    {
      mutationFn: updatePE,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sessions", user?.sub, sessionLocalDate],
        });
      },
    }
  );
};

export const useDeletePE = (id: string, sessionLocalDate: string) => {
  // Consume api, auth, and queryClient contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const deletePE = () =>
    api.delete<void>("performed-exercises/" + id).then(() => {});

  // Return useMutation hook
  return useMutation<void, AxiosError>({
    mutationFn: deletePE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub, sessionLocalDate],
      });
    },
  });
};
