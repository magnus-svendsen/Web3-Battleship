import { Button, Switch } from "@mantine/core";
import { useAccount, useDisconnect } from "wagmi";
import { useGameContext } from "../contexts/GameContext";
import AccountInfoHandle from "./AccountInfoHandle";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const {
    autoConfirmTransactions,
    setAutoConfirmTransactions,
    mode,
    setMode,
    singlePlayerJoined,
    gameStarted,
  } = useGameContext();

  return (
    <div className={`py-4 flex justify-between items-center ${account.status === "connected" ? "h-18" : ""}`}>
      <div className="font-bold text-2xl ml-3">
        {mode !== "none" &&
          singlePlayerJoined !== account.address &&
          !gameStarted && (
            <Button
              onClick={() => {
                setMode("none");
                localStorage.setItem("mode", JSON.stringify("none"));
              }}
              size="lg"
              color="red"
              radius="xl"
            >
              Back
            </Button>
          )}
      </div>
      {account.status === "connected" && (
        <div className="flex items-center">
          {account.connector.id !== "privateKey" && (
            <Button
              variant="white"
              color="teal"
              size="sm"
              radius="sm"
              className="mr-4"
              type="button"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          )}
          {account.connector.id === "privateKey" && (
            <>
              <Switch
                checked={autoConfirmTransactions}
                onChange={(event) =>
                  setAutoConfirmTransactions(event.currentTarget.checked)
                }
                label="Autoconfirm transactions"
                className="mr-2"
              />
              <div className="relative z-20">
                <AccountInfoHandle />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
