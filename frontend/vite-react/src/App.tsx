import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract } from "wagmi";
import GameGrid from "./components/GameGrid";
import { Button } from '@mantine/core';
import { contractAddress } from "./utils/contractAddress";
import { abi } from "./utils/abi";

function App() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();
  
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
    <div className="min-h-screen bg-[#002642] text-white">
      <div className="flex flex-col items-center">
        <div className="pt-4 pb-12 flex justify-between w-full">
          <h2 className="font-bold text-2xl ml-1">Web3 Battleship</h2>
          {account.status === "connected" && (
            <div className="flex">
              <Button variant="white" color="teal" size="sm" radius="sm" className="mr-2" type="button" onClick={() => disconnect()}>
                Disconnect
              </Button>

              <Button variant="red" color="teal" size="sm" radius="sm" className="mr-2" type="button" 
              onClick={() => writeContract({
                abi,
                address: contractAddress,
                functionName: "resetGame",
                args: [],
              })}>
                Reset game
              </Button>
              
            </div>
          )}
        </div>
        {account.status !== "connected" && (
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
              onKeyUp={(e) => { if (e.key === 'Enter') vippsAPI(); }}
            />
            <Button
              variant="white" color="orange" size="md" radius="xl"
              type="button"
              onClick={() => connect({ connector: connectors[0] })}
            >
              Log in with Metamask
            </Button>
          </div>
        )}
      </div>
      {account.status === "connected" && <GameGrid />}
    </div>
  );
}

export default App;
