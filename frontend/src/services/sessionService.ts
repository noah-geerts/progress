import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { dateToYYYYMMDD } from "../misc/dateHelpers";
import { AxiosError } from "axios";
import type { SessionResponseDto } from "../domain/Session/Session";
import type { SessionRequestDto } from "../domain/Session/SessionRequestDto";

export const useGetSession = (localDate: string) => {
  // Use auth and api contexts
  const { user } = useAuth0();
  const api = useApi();

  // Define query function using axios instance
  const getSession = () =>
    api
      .get<SessionResponseDto>("sessions/" + localDate)
      .then((response) => response.data);

  // Return tanstack query hook
  return useQuery<SessionResponseDto, AxiosError>({
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
      .post<SessionResponseDto>("sessions/" + localDate, body)
      .then((response) => response.data); // must return a promise that resolves to data

  // Return tanstack mutation hook
  return useMutation<SessionResponseDto, AxiosError, SessionRequestDto>({
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
      .patch<SessionResponseDto>("sessions/" + localDate, body)
      .then((response) => response.data);

  // Return tanstack mutation hook
  return useMutation<SessionResponseDto, AxiosError, SessionRequestDto>({
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

// Temporary function because there is no getWeeklySessions backend endpoint
// Ideally this would return a tanstack query hook and not the data itself
export const useGetWeeklySessions = (weekStart: Date) => {
  const sessions = [];
  const start = new Date(weekStart);
  for (let i = 0; i <= 6; i++) {
    const weekDay = new Date(start);
    weekDay.setDate(weekDay.getDate() + i);
    const localDate = dateToYYYYMMDD(weekDay);
    const { data } = useGetSession(localDate);
    if (data) sessions.push(data);
  }
  console.log(sessions);
  return sessions;
};
