import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
      <p>welcome to progress</p>{" "}
      <button onClick={() => loginWithRedirect()}>log in</button>{" "}
      <Link to="/loggedin">Go to dash</Link>
    </>
  );
}
