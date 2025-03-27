import { useEffect, useRef, useState } from "react";
import useGameWriteContract from "../hooks/useGameWriteContract";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { Button, Loader } from "@mantine/core";
import { useGameContext } from "../contexts/GameContext";
import ConstructionIcon from '@mui/icons-material/Construction';



const Footer = () => {
  const timeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const executeWriteContract = useGameWriteContract();
  const { gameReset, setGameReset, setErrorMessage, transactionCancelCount, setAutoConfirmTransactions, autoConfirmTransactions } = useGameContext();


  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: () => {
      setGameReset(true);
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
    <footer className="min-h-15 fixed left-0 bottom-0 w-full text-white text-right pr-4">
      {isLoading ?
        <Button
          size="sm"
          radius="sm"
          type="button"
          disabled={true}
          style={{
            background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7) 5px,rgba(255, 214, 79, 0.5) 5px,rgba(255, 214, 79, 0.5) 10px)',
            color: '#DEE5FF',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            stroke: '4px'

          }}
        > <Loader size="sm" />
        </Button>
        :
        <Button
          size="sm"
          radius="sm"
          type="button"
          onClick={() => handleGameReset()}
          style={{
            background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.7) 5px,rgba(255, 214, 79, 0.5) 5px,rgba(255, 214, 79, 0.5) 10px)',
            color: '#DEE5FF',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            stroke: '4px'
          }}
          >
          <ConstructionIcon></ConstructionIcon>Reset game<ConstructionIcon></ConstructionIcon>
        </Button>
      }
    </footer>
  )
}

export default Footer;