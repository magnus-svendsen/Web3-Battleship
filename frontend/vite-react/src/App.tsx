import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import GameGrid from "./components/GameGrid";
import { Button } from '@mantine/core';

function App() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

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
  }, []);

  return (
    <div className="min-h-screen bg-[#002642] text-white">
      <div className="flex flex-col items-center">
        <div className="pt-4 pb-12 flex justify-between w-full">
          <h2 className="font-bold text-2xl ml-1">Web3 Battleship</h2>
          {account.status === "connected" && (
            <div className="flex">
              <Button variant="white" color="teal" size="sm" radius="sm" className="mr-2" type="button" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </div>
          )}
        </div>
        {account.status !== "connected" && (
          <div className="flex flex-col items-center gap-8">
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
            />
            <Button
              variant="white" color="orange" size="xl" radius="xl"
              type="button"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Log in with Metamask
            </Button>
          </div>
        )}
      </div>
      <GameGrid />
    </div>
  );
}

export default App;
