import { useEffect } from "react";
import { useApi } from "../wrappers/ApiProvider";

export default function Dash() {
  const api = useApi();
  useEffect(() => {
    api.get("/private/hello").then((response) => console.log(response.data));
  }, []);

  return <p>Dashboard</p>;
}
