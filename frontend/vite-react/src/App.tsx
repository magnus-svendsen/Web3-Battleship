import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import GameGrid from "./components/gamegrid";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const vippsAPI = () => {
    // Redirect
    console.log("Redirect");
  };

  return (
    <>
      <div>
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
        ></vipps-mobilepay-button>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <GameGrid />
    </>
  );
}

export default App;
