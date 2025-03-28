import { Button, Loader } from "@mantine/core";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";
import { singlePlayerContractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useRef, useState } from "react";
import ShipPlacement from "./ShipPlacement";
import EnemyTerritory from "./EnemyTerritory";

const SinglePlayer = () => {
  const account = useAccount();

  const { writeContract } = useWriteContract();

  const {
    singlePlayerJoined,
    setSinglePlayerJoined,
    setErrorMessage,
    singlePlayerShipPlacementPlayer,
    setSinglePlayerShipPlacementPlayer,
    moveMessage,
    turnMessage,
    setMoveMessage,
    setTurnMessage,
    setEnemyGrid,
  } = useGameContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const handleStartGame = () => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to join game. Please try again");
    }, 60000); // 60sec timeout if no transaction is validated

    writeContract({
      abi: singlePlayerAbi,
      address: singlePlayerContractAddress,
      functionName: "startGame",
      args: [],
    });
  };

  useWatchContractEvent({
    address: singlePlayerContractAddress,
    abi: singlePlayerAbi,
    eventName: "PlayerJoined",
    onLogs(logs) {
      const player = logs[0].args.player ?? "";

      setSinglePlayerJoined(player);
      localStorage.setItem("singlePlayerJoined", JSON.stringify(player));
    },
    onError(error) {
      console.error("Error on event :", error);
    },
  });

  useEffect(() => {
    const savedSinglePlayerJoined = localStorage.getItem("singlePlayerJoined");
    if (savedSinglePlayerJoined) {
      setSinglePlayerJoined(JSON.parse(savedSinglePlayerJoined));
    }
    const savedSinglePlayerShipPlacementPlayer = localStorage.getItem(
      "singlePlayerShipPlacementPlayer"
    );
    if (savedSinglePlayerShipPlacementPlayer) {
      setSinglePlayerShipPlacementPlayer(
        JSON.parse(savedSinglePlayerShipPlacementPlayer)
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
    <div>
      {singlePlayerJoined !== account.address ? (
        <div className="flex justify-center mt-40">
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
        <div>
          <div className="font-bold text-2xl mt-12 flex justify-center">
            <h2
              className={`${turnMessage === "Your turn" ? "text-green-400" : ""}`}
            >
              {turnMessage}
            </h2>
          </div>
          <div className="mt-10 flex justify-center">
            <ShipPlacement />
            {singlePlayerShipPlacementPlayer === account.address && (
              <EnemyTerritory />
            )}
          </div>
          <div className="flex justify-center">
            <h2
              className={`font-bold text-2xl flex justify-center mt-10 mb-10 ${
                moveMessage === "Opponent shot and hit!" ||
                moveMessage === "You lost the game!"
                  ? "text-red-600"
                  : ""
              } ${
                moveMessage === "You shot and hit!" ||
                moveMessage === "You won the game!"
                  ? "text-green-400"
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
