import { useAuth0 } from "@auth0/auth0-react";
import axios, { type AxiosInstance } from "axios";
import { createContext, useContext } from "react";

const ApiContext = createContext<AxiosInstance | null>(null);

export function useApi(): AxiosInstance {
  const api = useContext(ApiContext);
  if (api === null) {
    throw new Error(
      "Axios Instance was not successfully provided to ApiProvider"
    );
  }
  return api;
}

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getAccessTokenSilently } = useAuth0();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (request) => {
      const accessToken = await getAccessTokenSilently();
      if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }
      console.log(JSON.stringify(request, null, 2));
      return request;
    },
    (error) => Promise.reject(error)
  );

  return <ApiContext value={api}>{children}</ApiContext>;
}
