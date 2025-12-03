import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ApiProvider from "./wrappers/ApiProvider";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import { ConfigProvider, theme } from "antd";
import AuthLoading from "./wrappers/AuthLoading";
import AuthGuard from "./wrappers/AuthGuard";
import Dashboard from "./pages/Dashboard";
import ProgressNotificationProvider from "./wrappers/ProgressNotificationProvider";
import Exercises from "./pages/Exercises";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <AuthLoading />,
    children: [{ path: "/", element: <Home></Home> }],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "exercises",
        element: <Exercises />,
      },
    ],
  },
]);

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
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
            <ReactQueryDevtools initialIsOpen={false} />
            <ConfigProvider
              theme={
                darkMode
                  ? {
                      algorithm: theme.darkAlgorithm,
                      components: {
                        Layout: {
                          headerBg: "#141414",
                        },
                      },
                    }
                  : {
                      components: {
                        Layout: {
                          headerBg: "#FFFFFF",
                        },
                      },
                    }
              }
            >
              <ProgressNotificationProvider>
                <RouterProvider router={router} />
              </ProgressNotificationProvider>
            </ConfigProvider>
          </QueryClientProvider>
        </ApiProvider>
      </Auth0Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
