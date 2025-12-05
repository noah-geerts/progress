import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import axios, { AxiosError } from "axios";
import type { Session } from "../domain/Session/Session";
import type { SessionRequestDto } from "../domain/Session/SessionRequestDto";

export const useGetSession = (localDate: string) => {
  const { user } = useAuth0();
  const api = useApi();

  const getSession = async (): Promise<Session | undefined> => {
    try {
      const response = await api.get<Session>("sessions/" + localDate);
      return response.data;
    } catch (error) {
      // Handle 404 as "no data" rather than an error
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined; // Return undefined instead of throwing
      }
      // Re-throw all other errors
      throw error;
    }
  };

  return useQuery<Session | undefined, AxiosError>({
    queryKey: ["sessions", user?.sub, localDate],
    queryFn: getSession,
    enabled: !!user,
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
        queryKey: ["sessions", user?.sub, localDate],
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
        queryKey: ["sessions", user?.sub, localDate],
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
        queryKey: ["sessions", user?.sub, localDate],
      });
    },
  });
};
