import { useAuth0 } from "@auth0/auth0-react";
import { Layout, Spin } from "antd";
import { Outlet } from "react-router";

export default function AuthLoading() {
  const { isLoading } = useAuth0();
  if (isLoading)
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Spin size="large"></Spin>
        </div>
      </Layout>
    );
  return <Outlet />;
}
