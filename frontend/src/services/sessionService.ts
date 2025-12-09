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
export const useGetMonthlySessions = (localDate: string) => {
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  const getMonthlySessions = async (): Promise<Session[]> => {
    const response = await api.get<Session[]>("sessions/monthly/" + localDate);
    return response.data;
  };

  const query = useQuery({
    queryKey: ["sessions", user?.sub, "monthly", localDate],
    queryFn: getMonthlySessions,
    enabled: !!user,
    select: (data) => {
      // Optionally set individual session cache entries when data is selected
      data.forEach((session) => {
        queryClient.setQueryData(
          ["sessions", user?.sub, session.date],
          session
        );
      });
      return data;
    },
  });

  return query;
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
