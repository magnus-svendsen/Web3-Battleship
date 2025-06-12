import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useConnect } from "wagmi";
import MetaMaskIcon from "../utils/images/MetaMask-icon-fox.svg";
import { serverAuthURL } from "../utils/serverURL";
import { frontendURL } from "../utils/frontendURL";

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
        window.location.href = serverAuthURL;
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
      window.history.replaceState("", "", frontendURL); // Remove accesstoken from URL
      connect({ connector: connectors[1] });
    }
  }, [connect, connectors]);

  return (
    <div>
      <div className="flex items-center justify-center mt-20 mb-10 gap-16 max-w-5xl">
        <div className="scale-114 transform-gpu">
          <vipps-mobilepay-button
            type="button"
            brand="vipps"
            language="en"
            variant="primary"
            rounded="true"
            verb="login"
            stretched="true"
            branded="true"
            loading="false"
            onClick={vippsAPI}
            onKeyUp={(e) => {
              if (e.key === "Enter") vippsAPI();
            }}
          />
        </div>
        <Button
          variant="white"
          color="black"
          size="lg"
          radius="xl"
          type="button"
          onClick={() => connect({ connector: connectors[0] })}
        >
          <img
            src={MetaMaskIcon}
            alt="MetaMask Icon"
            className="inline-block w-6 h-6 mr-2 mb-0.5 align-middle"
          />
          Log in with Metamask
        </Button>
      </div>
    </div>
  );
};

export default Login;
