import { Button, Loader } from "@mantine/core";
import { useAccount } from "wagmi";
import { useGameContext } from "../contexts/GameContext";
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useRef, useState } from "react";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { PlayerJoinedEvent } from "../types/eventTypes";
import useGameWriteContract from "../hooks/useGameWriteContract";

const GameLobby = () => {
  const account = useAccount();

  const { setErrorMessage, firstPlayerJoined, setFirstPlayerJoined, secondPlayerJoined, setSecondPlayerJoined, setGameStarted, setShowGameUnderway, transactionCancelCount } = useGameContext();
  
  const executeWriteContract = useGameWriteContract();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null);

  const handleJoinGame = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
      setErrorMessage("Failed to join game. Please try again")
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({ functionName: "join" });
  }

  useEffect(() => {
    setIsLoading(false)
    if(timeoutRef.current) {
      timeoutRef.current = null;
    }
  },[transactionCancelCount])

  useWatchContractEventListener({
    eventName: "FirstPlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";

      setFirstPlayerJoined(player);
      localStorage.setItem("firstPlayerJoined", JSON.stringify(player));

      if (player === account.address) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null
          console.log("Resetting timer: Join")

        }
        setIsLoading(false);
      }
    }
  });

  useWatchContractEventListener({
    eventName: "SecondPlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";

      setSecondPlayerJoined(player);
      localStorage.setItem("secondPlayerJoined", JSON.stringify(player));

      if (player === account.address) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null
        }
        setIsLoading(false);
      }
    }
  });

  const checkGameUnderway = () => {
    if (
      account.address !== firstPlayerJoined &&
      account.address !== secondPlayerJoined
    ) {
      setShowGameUnderway(true);
      localStorage.setItem("showGameUnderway", JSON.stringify(true));
    } else {
      setShowGameUnderway(false);
      localStorage.setItem("showGameUnderway", JSON.stringify(false));
    }
  };

  useEffect(() => {
    if (secondPlayerJoined) {
      checkGameUnderway();
      setGameStarted(true);
      localStorage.setItem("gameStarted", JSON.stringify(true));
    }
  }, [secondPlayerJoined]);

  useEffect(() => {
    const storedGameStarted = localStorage.getItem("gameStarted");
    if (storedGameStarted) {
      setGameStarted(JSON.parse(storedGameStarted));
    }
    const storedFirstPlayerJoined = localStorage.getItem("firstPlayerJoined");
    if (storedFirstPlayerJoined) {
      setFirstPlayerJoined(JSON.parse(storedFirstPlayerJoined));
    }
    const storedSecondPlayerJoined = localStorage.getItem("secondPlayerJoined");
    if (storedSecondPlayerJoined) {
      setSecondPlayerJoined(JSON.parse(storedSecondPlayerJoined));
    }
    const storedShowGameUnderway = localStorage.getItem("showGameUnderway");
    if (storedShowGameUnderway) {
      setShowGameUnderway(JSON.parse(storedShowGameUnderway));
    }
  }, []);

  return (
    <div>
      {account.address === firstPlayerJoined ? (
        <h2 className="font-bold text-2xl py-8">Waiting for opponent...</h2>
      ) : (
        <Button
          variant="filled"
          color="green"
          size="xl"
          radius="xl"
          type="button"
          onClick={handleJoinGame}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader />
          ) : firstPlayerJoined ? (
            <div className="flex gap-2">
              <div className="flex">
                <div className="mt-0.5">1</div>
                <div>
                  <PersonIcon />
                </div>
              </div>
              <div className="mt-0.5">Join a game!</div>
            </div>
          ) : (
            <>Create a game!</>
          )}
        </Button>
      )}
    </div>
  );
}


export default GameLobby;