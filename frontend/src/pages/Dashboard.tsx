import { Button } from "antd";
import { NavLink } from "react-router";

export default function Dashboard() {
  return (
    <Button>
      <NavLink to="/session">Go to session</NavLink>
    </Button>
  );
}
