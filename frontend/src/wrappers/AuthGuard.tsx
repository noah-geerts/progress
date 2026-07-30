import { useAuth0 } from "@auth0/auth0-react";
import { Layout, Spin } from "antd";
import { Navigate, Outlet } from "react-router";

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading)
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
          }}
        >
          <Spin size="large"></Spin>
        </div>
      </Layout>
    );
  if (isAuthenticated) return <Outlet />;
  return <Navigate to="/" />;
}
