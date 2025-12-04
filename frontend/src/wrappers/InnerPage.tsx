import { Button, Layout, Menu, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { NavLink, useLocation } from "react-router";

const navItems = [
  { key: "/dashboard", label: <NavLink to="/dashboard">Dashboard</NavLink> },
  { key: "/exercises", label: <NavLink to="/exercises">Exercises</NavLink> },
];

export default function InnerPage({ children }: { children: React.ReactNode }) {
  const {
    token: {
      colorBgContainer,
      paddingLG,
      fontWeightStrong,
      fontSizeLG,
      colorText,
    },
  } = theme.useToken();

  const location = useLocation();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          borderBottomColor: "#EEEEEE",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <NavLink
          to="/"
          style={{
            fontSize: fontSizeLG,
            fontWeight: fontWeightStrong,
            color: colorText,
          }}
        >
          Progress
        </NavLink>
        <Menu
          items={navItems}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Button variant="solid" color="danger">
          Log out
        </Button>
      </Header>
      <Content
        style={{
          background: colorBgContainer,
          padding: paddingLG,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
