import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Flex, Grid, Layout, Space, Switch, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { NavLink, useNavigate } from "react-router";
import { useEffect } from "react";
import { useDarkMode } from "../main";

export default function Home() {
  const {
    token: {
      colorBgContainer,
      paddingLG,
      paddingXS,
      borderRadiusLG,
      fontSizeLG,
      fontWeightStrong,
      colorText,
    },
  } = theme.useToken();

  const { darkMode, setDarkMode } = useDarkMode();

  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const themeSwitch = (
    <Switch
      checked={darkMode}
      onChange={setDarkMode}
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined />}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    />
  );

  if (isMobile) {
    return (
      <Layout style={{ height: "100vh", background: colorBgContainer }}>
        <Content
          style={{
            padding: paddingLG,
            background: colorBgContainer,
          }}
        >
          <Flex
            vertical
            align="center"
            justify="center"
            gap={172}
            style={{ height: "100%" }}
          >
            <Flex vertical align="center" gap={0}>
              <Title style={{ textAlign: "center" }}>
                Welcome to Progress
              </Title>
              <Title level={4} style={{ maxWidth: 360, textAlign: "center", margin: 0 }}>
                The workout tracking app with one goal: every week you train
                harder than the last
              </Title>
            </Flex>
            <Flex
              vertical
              align="center"
              gap={paddingLG}
              style={{ width: "100%" }}
            >
              {!isAuthenticated && (
                <Button
                  size="large"
                  variant="solid"
                  color="primary"
                  shape={isMobile ? "round" : "default"}
                  style={{ width: "100%", height: 52 }}
                  onClick={() => loginWithRedirect()}
                >
                  Log in
                </Button>
              )}
              {themeSwitch}
            </Flex>
          </Flex>
        </Content>
      </Layout>
    );
  }

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
          {themeSwitch}

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
