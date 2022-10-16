import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { healthCheck, refreshAccessTokenCookies } from "../lib/api/APIFunctions";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

function MainPage() {
  const [healthCheckResult, setHealthCheckResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (healthCheckResult !== "Hello World!") {
      return;
    }

    const moveToChat = async () => {
      await refreshAccessTokenCookies();
      navigate("/chat");
    };

    const moveToLogin = async () => {
      navigate("/login");
    };

    if (cookies.get("access_token")) {
      moveToChat();
    } else {
      moveToLogin();
    }
  }, [healthCheckResult]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await healthCheck();
        setHealthCheckResult(res?.data.toString());
      } catch (e) {
        console.log(e);
        setHealthCheckResult("health check failed");
      }
    };
    init();
  }, []);
  return (
    <div>
      <h1> Waicker</h1>
      What an interesting communication!
      <br />
      <div></div>
      <div>{healthCheckResult !== "health check failed" ? "Now available" : healthCheckResult}</div>
    </div>
  );
}

export default MainPage;
