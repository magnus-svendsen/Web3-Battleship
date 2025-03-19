import { Button, Loader } from "@mantine/core";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";
import { singlePlayerContractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";
import { useRef, useState } from "react";
import ShipPlacement from "./ShipPlacement";
import EnemyTerritory from "./EnemyTerritory";

const SinglePlayer = () => {
  const account = useAccount();

  const { writeContract } = useWriteContract();

  const { setErrorMessage, singlePlayerShipPlacementPlayer } = useGameContext();

  const [singlePlayerJoined, setSinglePlayerJoined] = useState<string | null>(
    localStorage.getItem("singlePlayerJoined")
  );
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

  return (
    <div>
      {singlePlayerJoined !== account.address ? (
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
      ) : (
        <ShipPlacement />
      )}
      {singlePlayerShipPlacementPlayer === account.address && (
        <EnemyTerritory />
      )}
    </div>
  );
};

export default SinglePlayer;
