import { Button, Loader, Switch } from "@mantine/core";
import { useAccount, useDisconnect } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameResetEvent } from "../types/eventTypes";
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import useGameWriteContract from "../hooks/useGameWriteContract";
import type { GameMode } from "../types/gameTypes";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const {
    setErrorMessage,
    autoConfirmTransactions, 
    setAutoConfirmTransactions, 
    gameReset, 
    setGameReset, 
    transactionCancelCount,
    mode
  } = useGameContext();

  const executeWriteContract = useGameWriteContract();
  const timeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: (_logs: GameResetEvent[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsLoading(false);
    },
  });

  const handleGameReset = (mode: GameMode) => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to reset game. Please try again")
    }, 60000);
    executeWriteContract({ functionName: "resetGame", mode });
  };

  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: () => {
      setGameReset(true);
    },
    mode,
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
      localStorage.removeItem("moveMessage");
      localStorage.removeItem("turnMessage");
      localStorage.removeItem("mode");
      localStorage.removeItem("singlePlayerJoined");
      // Then trigger a full page refresh.
      window.location.reload();
    }
  }, [gameReset]);

  useEffect(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [transactionCancelCount]);

  return (
    <div className="pt-4 pb-12 flex justify-between w-full">
      <h2 className="font-bold text-2xl ml-3">Web3 Battleship</h2>
      {account.status === "connected" && (
        <div className="flex items-center">
          {account.connector.id === "privateKey" && (
            <div className="pr-2 pt-2">
              <Switch
                checked={autoConfirmTransactions}
                onChange={(event) => setAutoConfirmTransactions(event.currentTarget.checked)}
                label="Autoconfirm transactions"
              />
            </div>
          )}
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
          {mode !== "none" && (
            isLoading ? (
              <Button
                variant="red"
                color="teal"
                size="sm"
                radius="sm"
                className="mr-2"
                type="button"
                disabled
              >
                <Loader />
              </Button>
            ) : (
              <Button
                variant="red"
                color="teal"
                size="sm"
                radius="sm"
                className="mr-2"
                type="button"
                onClick={() => handleGameReset(mode)}
              >
                Reset Game
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
