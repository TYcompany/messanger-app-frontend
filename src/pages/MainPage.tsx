import { useEffect, useState } from "react";
import { healthCheck } from "../lib/api/APIFunctions";

function MainPage() {
  const [healthCheckResult, setHealthCheckResult] = useState("");

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
      <div>{healthCheckResult}</div>
    </div>
  );
}

export default MainPage;
