import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ApiProvider from "./ApiProvider";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home";
import Dash from "./Dash";
import AuthGuard from "./AuthGuard";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/loggedout",
    element: <p>logged out allowed</p>,
  },
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "loggedin",
        element: <Dash />,
      },
      {
        path: "loggedin2",
        element: <p>loggedin2</p>,
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
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ApiProvider>
    </Auth0Provider>
  </StrictMode>
);
