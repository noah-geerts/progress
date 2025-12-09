import { Button, Layout, Menu, Switch, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { NavLink, useLocation } from "react-router";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useDarkMode } from "../main";
import { useAuth0 } from "@auth0/auth0-react";

const navItems = [
  { key: "/dashboard", label: <NavLink to="/dashboard">Dashboard</NavLink> },
  { key: "/exercises", label: <NavLink to="/exercises">Exercises</NavLink> },
  { key: "/calendar", label: <NavLink to="/calendar">Calendar</NavLink> },
];

export default function InnerPage({ children }: { children: React.ReactNode }) {
  const {
    token: {
      colorBgContainer,
      paddingLG,
      fontWeightStrong,
      fontSizeLG,
      colorText,
      colorBorder,
    },
  } = theme.useToken();

  const location = useLocation();
  const { logout } = useAuth0();
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          borderBottomColor: colorBorder,
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
          style={{ flex: 1, minWidth: 0, borderBottomColor: colorBorder }}
        />
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        />
        <Button variant="solid" color="danger" onClick={() => logout()}>
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
