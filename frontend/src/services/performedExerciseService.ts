import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { AxiosError } from "axios";
import type { PerformedExerciseResponseDto } from "../domain/PerformedExercise/PerformedExercise";
import type { CreatePerformedExerciseDto } from "../domain/PerformedExercise/CreatePerformedExerciseDto";
import type { UpdatePerformedExerciseDto } from "../domain/PerformedExercise/UpdatePerformedExerciseDto";

export const useCreatePE = () => {
  // Use auth, api, and query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const createPE = (body: CreatePerformedExerciseDto) =>
    api
      .post<PerformedExerciseResponseDto>("performed-exercises", body)
      .then((response) => response.data);

  // Return useMutation hook
  return useMutation<
    PerformedExerciseResponseDto,
    AxiosError,
    CreatePerformedExerciseDto
  >({
    mutationFn: createPE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useUpdatePE = (peid: number) => {
  // Consume api, auth, and queryClient contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const updatePE = (body: UpdatePerformedExerciseDto) =>
    api
      .patch<PerformedExerciseResponseDto>("performed-exercises/" + peid, body)
      .then((response) => response.data);

  // Return useMutation hook
  return useMutation<
    PerformedExerciseResponseDto,
    AxiosError,
    UpdatePerformedExerciseDto
  >({
    mutationFn: updatePE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useDeletePE = (peid: number) => {
  // Consume api, auth, and queryClient contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const deletePE = () =>
    api.delete<void>("performed-exercises/" + peid).then(() => {});

  // Return useMutation hook
  return useMutation<void, AxiosError>({
    mutationFn: deletePE,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};
