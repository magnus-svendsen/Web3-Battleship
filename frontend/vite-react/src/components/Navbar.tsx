import { Button, Loader, Switch } from "@mantine/core";
import { useAccount, useDisconnect } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameResetEvent } from "../types/eventTypes";
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import useGameWriteContract from "../hooks/useGameWriteContract";
import AccountInfoHandle from "./AccountInfoHandle";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const { gameReset, setGameReset, setErrorMessage, transactionCancelCount, setAutoConfirmTransactions, autoConfirmTransactions } = useGameContext();
  const executeWriteContract = useGameWriteContract();

  const timeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: (_logs: GameResetEvent[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null
      }
      setIsLoading(false);
    },
  });

  const handleGameReset = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
      setErrorMessage("Failed to reset game. Please try again")
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({ functionName: "resetGame" });
  }

  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: () => {
      setGameReset(true);
    },
  });

  useEffect(() => {
    if (gameReset) {
      // Clear localStorage items related to the game.
      localStorage.removeItem("gameStarted");
      localStorage.removeItem("firstPlayerJoined");
      localStorage.removeItem("secondPlayerJoined");
      localStorage.removeItem("showGameUnderway");

      localStorage.removeItem("shipPlacementPlayer");
      localStorage.removeItem("grid");
      localStorage.removeItem("shipsSubmitted");
      localStorage.removeItem("placedShips");
      localStorage.removeItem("shipPositions");
      localStorage.removeItem("bothPlayersPlacedShips");

      localStorage.removeItem("enemyGrid");
      localStorage.removeItem("shipPositions");
      localStorage.removeItem("moveMessage");
      localStorage.removeItem("turnMessage");

      // Then trigger a page refresh.
      window.location.reload();
    }
  }, [gameReset]);

  useEffect(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null
    }
  }, [transactionCancelCount])

  return (
    <div className="pt-4 pb-12 flex justify-between w-full">
      <h2 className="font-bold text-2xl ml-3">Web3 Battleship</h2>
      {account.status === "connected" && (
        <div className="flex">
          {account.connector.id !== "privateKey" &&
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
          }
          {isLoading ?
            <Button
              variant="red"
              color="teal"
              size="sm"
              radius="sm"
              className="mr-2"
              type="button"
              disabled={true}
            > <Loader />
            </Button>
            :
            <Button
              variant="red"
              color="teal"
              size="sm"
              radius="sm"
              className="mr-2"
              type="button"
              onClick={() => handleGameReset()}
            >
              Reset game
            </Button>
          }
          {account.connector.id === "privateKey" && <>
            
            <Switch
              checked={autoConfirmTransactions}
              onChange={(event) => setAutoConfirmTransactions(event.currentTarget.checked)}
              label="Autoconfirm transactions"
              className="pt-2 pr-2"
            />
            <AccountInfoHandle />
          </>
          }
        </div>
      )}
    </div>
  );
};

export default Navbar;
