import { useAuth0 } from "@auth0/auth0-react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApi } from "../wrappers/ApiProvider";
import { dateToYYYYMMDD } from "../misc/dateHelpers";
import { AxiosError, type AxiosResponse } from "axios";
import type { SessionResponseDto } from "../domain/Session/Session";
import type { SessionRequestDto } from "../domain/Session/SessionRequestDto";

export const useGetSession = (localDate: string) => {
  const { user } = useAuth0();
  const api = useApi();
  const getSession = async () => {
    try {
      const response = await api.get<SessionResponseDto | undefined>(
        "sessions/" + localDate
      );
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404)
        return undefined;
      throw err;
    }
  };
  return useQuery<SessionResponseDto | undefined>({
    queryKey: ["session", user?.sub, localDate],
    queryFn: getSession,
  });
};

export const useCreateSession = (localDate: string) => {
  const { user } = useAuth0();
  const api = useApi();
  const queryClient = useQueryClient();

  const createSession = (body: SessionRequestDto) =>
    api.post("sessions/" + localDate, body).then((response) => response.data);
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session", user?.sub, localDate],
      });
    },
  });
};

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
