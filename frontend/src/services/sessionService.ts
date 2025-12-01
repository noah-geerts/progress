import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import axios, { AxiosError } from "axios";
import type { Session } from "../domain/Session/Session";
import type { SessionRequestDto } from "../domain/Session/SessionRequestDto";

export const useGetSession = (localDate: string) => {
  // Use auth and api contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define query function using axios instance
  const getSession = async (): Promise<Session> => {
    try {
      const response = await api.get<Session>("sessions/" + localDate);
      return response.data;
    } catch (error) {
      // Set data to undefined on 404 because that means it doesn't exist
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        queryClient.setQueryData(
          ["sessions", user?.sub, "2025-10-15"],
          undefined
        );
      }
      throw error as AxiosError;
    }
  };

  // Return tanstack query hook
  return useQuery<Session, AxiosError>({
    queryKey: ["sessions", user?.sub, localDate],
    queryFn: getSession,
    retry: (failureCount, error) =>
      ![404].includes(error.response?.status ?? 0), // Do not retry on 404. This is a meaningful response
  });
};

// localDate is passed to the hook rather than in mutate() because the query key depends on it as well as the path for the
// query url. If it was just data (body or query param), it would be better for it to live in the mutate() parameter
export const useCreateSession = (localDate: string) => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const createSession = (
    body: SessionRequestDto // mutationFn parameters are expected in mutate and mutateAsync and are passed to the mutationFn
  ) =>
    api
      .post<Session>("sessions/" + localDate, body)
      .then((response) => response.data); // must return a promise that resolves to data

  // Return tanstack mutation hook
  return useMutation<Session, AxiosError, SessionRequestDto>({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useUpdateSession = (localDate: string) => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const updateSession = (body: SessionRequestDto) =>
    api
      .patch<Session>("sessions/" + localDate, body)
      .then((response) => response.data);

  // Return tanstack mutation hook
  return useMutation<Session, AxiosError, SessionRequestDto>({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};

export const useDeleteSession = (localDate: string) => {
  // Use auth, api, and tanstack query contexts
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  // Define mutation function
  const deleteSession = () =>
    api.delete<void>("sessions/" + localDate).then(() => {});

  // Return tanstack mutation hook
  return useMutation<void, AxiosError>({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", user?.sub],
      });
    },
  });
};
