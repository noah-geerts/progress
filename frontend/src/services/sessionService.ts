import { useAuth0 } from "@auth0/auth0-react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import axios, { AxiosError } from "axios";
import type { Session } from "../domain/Session/Session";
import type { SessionRequestDto } from "../domain/Session/SessionRequestDto";

export const useGetSession = (localDate: string) => {
  const { user } = useAuth0();
  const api = useApi();

  const getSession = async (): Promise<Session> => {
    const response = await api.get<Session>("sessions/" + localDate);
    return response.data;
  };

  return useQuery<Session, AxiosError>({
    queryKey: ["sessions", user?.sub, localDate],
    queryFn: getSession,
    enabled: !!user,
    retry: (failureCount, error) => {
      // Don't retry on 404 - it means the session doesn't exist
      if (error.response?.status === 404) return false;
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });
};

// Hook to fetch multiple sessions for a list of dates
export const useGetMonthSessions = (dates: string[]) => {
  const { user } = useAuth0();
  const api = useApi();

  const getSession = async (localDate: string): Promise<Session> => {
    const response = await api.get<Session>("sessions/" + localDate);
    return response.data;
  };

  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: ["sessions", user?.sub, date],
      queryFn: () => getSession(date),
      enabled: !!user,
      retry: (failureCount: number, error: AxiosError) => {
        // Don't retry on 404 - it means the session doesn't exist
        if (error.response?.status === 404) return false;
        // Retry other errors up to 3 times
        return failureCount < 3;
      },
    })),
  });

  // Convert queries results to a Map
  // For 404s (isError with 404 status), treat as undefined session
  const monthSessions = new Map<string, Session | undefined>();
  queries.forEach((query, index) => {
    if (query.isSuccess) {
      monthSessions.set(dates[index], query.data);
    } else if (
      query.isError &&
      (query.error as AxiosError).response?.status === 404
    ) {
      monthSessions.set(dates[index], undefined);
    }
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some(
    (query) =>
      query.isError && (query.error as AxiosError).response?.status !== 404
  );

  return {
    monthSessions,
    isLoading,
    isError,
  };
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
