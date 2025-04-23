import { useEffect, useRef, useState } from "react";
import useGameWriteContract from "../hooks/useGameWriteContract";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { Button, Loader, Modal } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import ConstructionIcon from "@mui/icons-material/Construction";
import NewUserInformation from "../components/NewUserInformation";
import type { GameMode } from "../types/gameTypes";

const Footer = () => {
  const timeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoModalOpened, setInfoModalOpened] = useState(false);

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
    <>
      <footer className="fixed bottom-0 left-0 w-full px-4 pb-4 flex justify-between items-end z-50">
        {/* ℹ️ Information Button – Always visible */}
        <Button
          color="blue"
          variant="filled"
          size="sm"
          onClick={() => setInfoModalOpened(true)}
        >
          ℹ️ Information
        </Button>

        {/* 🔁 Reset Button – Only visible if mode !== "none" */}
        {mode !== "none" &&
          (isLoading ? (
            <Button
              size="sm"
              radius="sm"
              disabled
              style={{
                background:
                  "repeating-linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7) 5px,rgba(255, 214, 79, 0.5) 5px,rgba(255, 214, 79, 0.5) 10px)",
                color: "#DEE5FF",
              }}
            >
              <Loader size="sm" />
            </Button>
          ) : (
            <Button
              size="sm"
              radius="sm"
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
          ))}
      </footer>

      {/* Modal: Web3 Information */}
      <Modal
        opened={infoModalOpened}
        onClose={() => setInfoModalOpened(false)}
        size="lg"
        centered
        title="ℹ️ About Web3 & This Game"
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.55,
        }}
        styles={{
          header: { backgroundColor: "#002642", color: "white" },
          body: {
            backgroundColor: "#001D32",
            color: "white",
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
          },
        }}
        classNames={{
          body: "custom-scrollbar", // Tailwind-style class
        }}
      >
        <NewUserInformation />
      </Modal>
    </>
  );
};

export default Footer;
