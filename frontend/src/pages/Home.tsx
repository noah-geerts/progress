import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Flex, Layout, Switch, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { NavLink } from "react-router";
import { useDarkMode } from "../main";

export default function Home() {
  const {
    token: {
      colorBgContainer,
      paddingLG,
      borderRadiusLG,
      fontSizeLG,
      fontWeightStrong,
      colorText,
    },
  } = theme.useToken();

  const { darkMode, setDarkMode } = useDarkMode();

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: fontSizeLG,
            color: colorText,
            fontWeight: fontWeightStrong,
          }}
        >
          Progress
        </p>
        <Flex gap={24} align="center">
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          />

          {isAuthenticated ? (
            <Button variant="solid" color="primary">
              <NavLink to="/dashboard">Go to dashboard</NavLink>
            </Button>
          ) : (
            <Button
              variant="solid"
              color="primary"
              onClick={() => loginWithRedirect()}
            >
              Log in
            </Button>
          )}
        </Flex>
      </Header>
      <Content style={{ padding: paddingLG }}>
        <Flex
          vertical
          align="center"
          justify="center"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "100%",
          }}
        >
          <Title>Welcome to Progress</Title>
          <Title level={4}>
            The workout tracking app with one goal: every week you train harder
            than the last
          </Title>
        </Flex>
      </Content>
    </Layout>
  );
}
