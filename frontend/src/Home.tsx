import { useAuth0 } from "@auth0/auth0-react";
import { Button, Typography } from "antd";
const { Title, Paragraph, Text } = Typography;
import { Link, NavLink } from "react-router";
import P from "./components/P";

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="w-full h-full flex flex-col items-center">
      <nav className="w-full h-16 flex flex-row justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <P>Progress</P>
        {isAuthenticated ? (
          <Button>
            <NavLink to="/dashboard">Go to dashboard</NavLink>
          </Button>
        ) : (
          <Button onClick={() => loginWithRedirect()}>Log in</Button>
        )}
      </nav>
      <div className="w-1/2 flex-1 flex flex-col justify-center items-center">
        <Typography>
          <Title className="text-center">Welcome to Progress</Title>
          <Title level={3} className="font-normal text-center">
            The simple workout tracking app with one goal: every week you train
            harder than the last
          </Title>
        </Typography>
        {isAuthenticated ? (
          <Button type="primary" className="mt-4">
            <NavLink to="/dashboard">Go to dashboard</NavLink>
          </Button>
        ) : (
          <Button
            type="primary"
            className="mt-4"
            onClick={() => loginWithRedirect()}
          >
            Get started
          </Button>
        )}
      </div>
    </div>
  );
}
