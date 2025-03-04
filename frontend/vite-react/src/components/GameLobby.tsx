import { Button, Loader } from "@mantine/core";
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useRef, useState } from "react";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { PlayerJoinedEvent } from "../types/eventTypes";

const GameLobby = () => {
  const { firstPlayerJoined, setErrorMessage } = useGameContext();
  const { writeContract } = useWriteContract();
  const account = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null);

  const handleJoinGame = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
      setErrorMessage("Failed to join game. Please try again")
    }, 60000); // 60sec timeout if no transaction is validated
    writeContract({
      abi,
      address: contractAddress,
      functionName: "join",
      args: [],
    })
  }

  useWatchContractEventListener({
    eventName: "FirstPlayerJoined",
    onEvent: (_logs: PlayerJoinedEvent[]) => {
      console.log(account.address)
      console.log(_logs[0].args.player)
      if (_logs[0].args.player === account.address) {
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
    onEvent: (_logs: PlayerJoinedEvent[]) => {
      console.log(account.address)
      console.log(_logs[0].args.player)
      if (_logs[0].args.player === account.address) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null
        }
        setIsLoading(false);
      }
    }
  });


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
            <>Join a game!</>
          )}
        </Button>
      )}
    </div>
  );
}


export default GameLobby;