import { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import GameGrid from "./components/gamegrid";

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

        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
      </div>
      <GameGrid />
    </>
  );
}

export default App;
