import { Button, Loader, Switch } from "@mantine/core";
import { useAccount, useDisconnect, useWatchContractEvent, useWriteContract } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameResetEvent } from "../types/eventTypes";
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";
import useGameWriteContract from "../hooks/useGameWriteContract";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";
import { singlePlayerContractAddress } from "../utils/contractAddress";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();

  const { autoConfirmTransactions, gameReset, setGameReset, setErrorMessage, setAutoConfirmTransactions, transactionCancelCount } = useGameContext();
  const executeWriteContract = useGameWriteContract();

  const { writeContract } = useWriteContract();

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

  const handleGameResetMultiplayer = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
      setErrorMessage("Failed to reset game. Please try again")
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({ functionName: "resetGame" });
  }

  const handleGameResetSinglePlayer = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
      setErrorMessage("Failed to reset game. Please try again")
    }, 60000); // 60sec timeout if no transaction is validated

    writeContract({
      abi: singlePlayerAbi,
      address: singlePlayerContractAddress,
      functionName: "resetGame",
      args: [],
    });
  }

  useWatchContractEvent({
    eventName: "SinglePlayerGameReset",
    address: singlePlayerContractAddress,
    abi: singlePlayerAbi,
    onLogs() {
      setGameReset(true);
    },
  });

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
      localStorage.removeItem("bothPlayersPlacedShips");

      localStorage.removeItem("enemyGrid");
      localStorage.removeItem("shipPositions");
      localStorage.removeItem("moveMessage");
      localStorage.removeItem("turnMessage");

      localStorage.removeItem("mode");
      localStorage.removeItem("singlePlayerJoined");
      localStorage.removeItem("singlePlayerShipPlacementPlayer");

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
  },[transactionCancelCount])

  return (
    <div className="pt-4 pb-12 flex justify-between w-full">
      <h2 className="font-bold text-2xl ml-3">Web3 Battleship</h2>
      {account.status === "connected" && (
        <div className="flex">
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
              onClick={() => handleGameResetMultiplayer()}
            >
              Reset Mulltiplayer
            </Button>
          }
          {isLoading ?
            <Button
              color="red"
              size="sm"
              radius="sm"
              className="mr-2"
              type="button"
              disabled={true}
            > <Loader />
            </Button>
            :
            <Button
              color="red"
              size="sm"
              radius="sm"
              className="mr-2"
              type="button"
              onClick={() => handleGameResetSinglePlayer()}
            >
              Reset Single Player
            </Button>
          }
        </div>
      )}
    </div>
  );
};

export default Navbar;
