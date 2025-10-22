import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { AxiosError } from "axios";
import type { SetResponseDto } from "../domain/PerformedSet/PerformedSet";
import type { CreateSetDto } from "../domain/PerformedSet/CreatePerformedSetDto";
import type { UpdateSetDto } from "../domain/PerformedSet/UpdatePerformedSetDto";

export const useCreateSet = () => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define query function using axios instance
  const createSet = (body: CreateSetDto) =>
    api.post<SetResponseDto>("sets", body).then((response) => response.data);

  // Return tanstack query hook
  return useMutation<SetResponseDto, AxiosError, CreateSetDto>({
    mutationFn: createSet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useUpdateSet = (stid: number) => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define query function using axios instance
  const updateSet = (body: UpdateSetDto) =>
    api
      .patch<SetResponseDto>("sets/" + stid, body)
      .then((response) => response.data);

  // Return tanstack query hook
  return useMutation<SetResponseDto, AxiosError, UpdateSetDto>({
    mutationFn: updateSet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useDeleteSet = (stid: number) => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define query function using axios instance
  const deleteSet = () => api.delete<void>("sets/" + stid).then(() => {});

  // Return tanstack query hook
  return useMutation<void, AxiosError>({
    mutationFn: deleteSet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};
