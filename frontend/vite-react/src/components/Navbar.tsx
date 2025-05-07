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
    <div className="pt-4 flex justify-between w-full">
      <div className="font-bold text-2xl ml-3">
        {mode !== "none" &&
          singlePlayerJoined !== account.address &&
          !gameStarted && (
            <Button
              onClick={() => {
                setMode("none");
                localStorage.setItem("mode", JSON.stringify("none"));
              }}
              className=""
              size="xl"
              color="red"
              radius="xl"
            >
              Back
            </Button>
          )}
      </div>
      {account.status === "connected" && (
        <div className="flex">
          {account.connector.id !== "privateKey" && (
            <Button
              variant="white"
              color="teal"
              size="sm"
              radius="sm"
              className="mr-2"
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
                className="pt-2 pr-2"
              />
              <AccountInfoHandle />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
