import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useConnect } from "wagmi";

const Login = () => {
  const { connectors, connect } = useConnect();

  const vippsAPI = async () => {
    // Redirect
    console.log(connectors);
    if (localStorage.getItem("accesstoken") != null) {
      console.log(connectors);
      connect({ connector: connectors[1] });
    } else {
      try {
        window.location.href = "http://localhost:5173/auth/vipps";
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Get Accesstoken if present in URL, then remove it from the URL
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const accessToken = search.get("accesstoken") as string;
    if (accessToken != null) {
      localStorage.setItem("accesstoken", accessToken);
      window.history.replaceState("", "", "http://localhost:3000"); // Remove accesstoken from URL
      connect({ connector: connectors[1] });
    }
  }, [connect, connectors]);

  return (
    <div className="flex items-center my-28 gap-10">
      <vipps-mobilepay-button
        type="button"
        brand="vipps"
        language="en"
        variant="primary"
        rounded="true"
        verb="login"
        stretched="false"
        branded="true"
        loading="false"
        onClick={vippsAPI}
        onKeyUp={(e) => {
          if (e.key === "Enter") vippsAPI();
        }}
      />
      <Button
        variant="white"
        color="orange"
        size="md"
        radius="xl"
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
      >
        Log in with Metamask
      </Button>
    </div>
  );
};

export default Login;
