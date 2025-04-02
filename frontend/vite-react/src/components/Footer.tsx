import { useEffect, useRef, useState } from "react";
import useGameWriteContract from "../hooks/useGameWriteContract";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { Button, Loader } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import ConstructionIcon from "@mui/icons-material/Construction";
import type { GameMode } from "../types/gameTypes";

const Footer = () => {
  const timeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const executeWriteContract = useGameWriteContract();
  const {
    mode,
    gameReset,
    setGameReset,
    setErrorMessage,
    transactionCancelCount,
  } = useGameContext();

  const handleGameReset = (mode: GameMode) => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to reset game. Please try again");
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
      
      localStorage.removeItem("timesHit");
      localStorage.removeItem("timesMiss");
      localStorage.removeItem("enemyTimesHit");
      localStorage.removeItem("enemyTimesMiss");
      localStorage.removeItem("turnNumber");

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
    <div>
      {mode !== "none" && (
        <footer className="min-h-15 fixed left-0 bottom-0 w-full text-white text-right pr-4">
          {isLoading ? (
            <Button
              size="sm"
              radius="sm"
              type="button"
              disabled={true}
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7) 5px,rgba(255, 214, 79, 0.5) 5px,rgba(255, 214, 79, 0.5) 10px)",
                color: "#DEE5FF",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                stroke: "4px",
              }}
            >
              {" "}
              <Loader size="sm" />
            </Button>
          ) : (
            <Button
              size="sm"
              radius="sm"
              type="button"
              onClick={() => handleGameReset(mode)}
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7) 5px,rgba(255, 214, 79, 0.5) 5px,rgba(255, 214, 79, 0.5) 10px)",
                color: "#DEE5FF",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                stroke: "4px",
              }}
            >
              <ConstructionIcon /> Reset game <ConstructionIcon />
            </Button>
          )}
        </footer>
      )}
    </div>
  );
};

export default Footer;
