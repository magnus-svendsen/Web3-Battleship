import { Button, Loader } from "@mantine/core";
import { useAccount, useWatchContractEvent } from "wagmi";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";
import { singlePlayerContractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useRef, useState } from "react";
import useGameWriteContract from "../hooks/useGameWriteContract";
import ShipPlacement from "./ShipPlacement";
import EnemyTerritory from "./EnemyTerritory";
import GameStatsBox from "./GameStatsBox";
import { verifyAddressAndInitProps } from "../utils/verifyAddress";

const SinglePlayer = () => {
  const account = useAccount();

  const {
    shipPlacementPlayer,
    setShipPlacementPlayer,
    singlePlayerJoined,
    setSinglePlayerJoined,
    setErrorMessage,
    moveMessage,
    turnMessage,
    setMoveMessage,
    setTurnMessage,
    setEnemyGrid,
    mode,
    setOpponentInfoProps,
    setPlayerInfoProps,
  } = useGameContext();

  const executeWriteContract = useGameWriteContract();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (account.address) {
      verifyAddressAndInitProps(account.address, false, setOpponentInfoProps, setPlayerInfoProps);
    }
  }, [account.address]);

  const handleStartGame = () => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to join game. Please try again");
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({ functionName: "startGame", mode });
  };

  useWatchContractEvent({
    address: singlePlayerContractAddress,
    abi: singlePlayerAbi,
    eventName: "PlayerJoined",
    onLogs(logs) {
      const player = logs[0].args.player ?? "";
      setSinglePlayerJoined(player);
      localStorage.setItem("singlePlayerJoined", JSON.stringify(player));
      // Set AI opponent info when game starts
      setOpponentInfoProps({
        address: "0x0000000000000000000000000000000000000000",
        isOpponent: true,
        isAI: true
      });
      // Set player info when game starts
      if (account.address) {
        verifyAddressAndInitProps(account.address, false, setOpponentInfoProps, setPlayerInfoProps);
      }
      // Clear the timeout when player successfully joins
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsLoading(false);
    },
    onError(error) {
      console.error("Error on event :", error);
    },
  });

  useEffect(() => {
    const savedSinglePlayerJoined = localStorage.getItem("singlePlayerJoined");
    if (savedSinglePlayerJoined) {
      setSinglePlayerJoined(JSON.parse(savedSinglePlayerJoined));
      // Set AI opponent info when loading saved game
      setOpponentInfoProps({
        address: "0x0000000000000000000000000000000000000000",
        isOpponent: true,
        isAI: true
      });
      // Set player info when loading saved game
      if (account.address) {
        verifyAddressAndInitProps(account.address, false, setOpponentInfoProps, setPlayerInfoProps);
      }
    }
    const savedShipPlacementPlayer = localStorage.getItem("shipPlacementPlayer");
    if (savedShipPlacementPlayer) {
      setShipPlacementPlayer(
        JSON.parse(savedShipPlacementPlayer)
      );
    }
    const savedMoveMessage = localStorage.getItem("moveMessage");
    if (savedMoveMessage) {
      setMoveMessage(JSON.parse(savedMoveMessage));
    }
    const savedTurnMessage = localStorage.getItem("turnMessage");
    if (savedTurnMessage) {
      setTurnMessage(JSON.parse(savedTurnMessage));
    }
    const savedEnemyGrid = localStorage.getItem("enemyGrid");
    if (savedEnemyGrid) {
      setEnemyGrid(JSON.parse(savedEnemyGrid));
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {singlePlayerJoined !== account.address ? (
        <div className="flex justify-center">
          <Button
            variant="filled"
            color="green"
            size="xl"
            radius="xl"
            type="button"
            onClick={handleStartGame}
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : <>Start game</>}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="font-bold text-2xl mb-4">
            <h2
              className={`${turnMessage === "Your turn" ? "text-[rgb(0,200,100)]" : ""}`}
            >
              {turnMessage}
            </h2>
          </div>
          <div className="flex justify-center items-center gap-8">
            {shipPlacementPlayer === account.address && (
              <GameStatsBox />
            )}
            <ShipPlacement />
            {shipPlacementPlayer === account.address && (
              <EnemyTerritory />
            )}
          </div>
          <div className="flex justify-center mt-4">
            <h2
              className={`font-bold text-2xl ${
                moveMessage === "Opponent shot and hit!" ||
                moveMessage === "You lost the game!"
                  ? "text-[rgb(220,60,60)]"
                  : ""
              } ${
                moveMessage === "You shot and hit!" ||
                moveMessage === "You won the game!"
                  ? "text-[rgb(0,200,100)]"
                  : ""
              }`}
            >
              {moveMessage}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePlayer;
