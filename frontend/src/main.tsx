import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ApiProvider from "./wrappers/ApiProvider";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home";
import Session from "./pages/Session";
import AuthGuard from "./wrappers/AuthGuard";
import { ConfigProvider, theme } from "antd";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "session",
        element: <Session />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-7depnj7pxm3mr8iz.us.auth0.com"
      clientId="NE0G4iFTrYmrWnojflLovyHe8mh2fNoC"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://localhost:3000",
      }}
    >
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </QueryClientProvider>
      </ApiProvider>
    </Auth0Provider>
  </StrictMode>
);
