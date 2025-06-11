import { Button, Loader } from "@mantine/core";
import { useAccount, useReadContract } from "wagmi";
import { useGameContext } from "../contexts/GameContext";
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useRef, useState } from "react";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { PlayerJoinedEvent } from "../types/eventTypes";
import useGameWriteContract from "../hooks/useGameWriteContract";
import { zeroAddress } from "viem";
import { multiplayerContractAddress } from "../utils/contractAddress";
import { multiplayerAbi } from "../utils/abi/multiplayerAbi";
import PlayerCard from "./PlayerCard";
import { verifyAddressAndInitProps } from "../utils/verifyAddress";

const GameLobby = () => {
  const account = useAccount();

  const { setErrorMessage, firstPlayerJoined, setFirstPlayerJoined, secondPlayerJoined, setSecondPlayerJoined, setGameStarted, setShowGameUnderway, transactionCancelCount, opponentInfoProps, setOpponentInfoProps, setPlayerInfoProps, playerInfoProps } = useGameContext();

  const executeWriteContract = useGameWriteContract();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null);

  const [opponent, setOpponent] = useState("")
  const { data: player1, error } = useReadContract({
    address: multiplayerContractAddress,
    abi: multiplayerAbi,
    functionName: "player1"
  })

  useWatchContractEventListener({
    eventName: "FirstPlayerJoined",
    onEvent: (logs) => {
      const address = logs[0].args.player
      if (!isZeroAddress(address) && account.address !== address) {
        setOpponent(address)
      }
    },
  })

  useEffect(() => {
    if (!isZeroAddress(player1)) {
      if (account.address !== player1) {
        setOpponent(player1 ?? "")
      }
    }
    if (opponent) {
      verifyAddressAndInitProps(opponent, true, setOpponentInfoProps, setPlayerInfoProps)
    }
  }, [opponent, player1])

  useEffect(() => {
    if (account.address){
      verifyAddressAndInitProps(account.address, false, setOpponentInfoProps, setPlayerInfoProps)
    }
  },[])

  const isZeroAddress = (address?: string) => {
    return !address || address === zeroAddress
  }

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
    if (timeoutRef.current) {
      timeoutRef.current = null;
    }
  }, [transactionCancelCount])

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
        }
        setIsLoading(false);
      }
    }
  });

  useWatchContractEventListener({
    eventName: "SecondPlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";
  
      if (account.address === firstPlayerJoined && player !== zeroAddress) {
        setOpponent(player);
        verifyAddressAndInitProps(player, true, setOpponentInfoProps, setPlayerInfoProps);
      }
  
      setSecondPlayerJoined(player);
      localStorage.setItem("secondPlayerJoined", JSON.stringify(player));
  
      if (player === account.address) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsLoading(false);
      }
    },
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
    const savedFirstPlayerJoined = localStorage.getItem("firstPlayerJoined");
    if (savedFirstPlayerJoined) {
      setFirstPlayerJoined(JSON.parse(savedFirstPlayerJoined));
    }
  }, []);

  return (
    <div className="mt-16 flex justify-center">
      <div className="flex flex-col gap-4 w-full max-w-sm px-4">
        {account.address === firstPlayerJoined && !secondPlayerJoined && (
          <h2 className="text-white font-bold text-2xl text-center py-4">
            Waiting for opponent…
          </h2>
        )}

        {!(account.address === firstPlayerJoined && !secondPlayerJoined) && (
          <Button
            fullWidth
            variant="filled"
            color="green"
            size="xl"
            radius="xl"
            onClick={handleJoinGame}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : opponentInfoProps.address !== zeroAddress ? (
              <div className="flex items-center gap-2">
                <PersonIcon /> <span>Join a game!</span>
              </div>
            ) : (
              "Create a game!"
            )}
          </Button>
        )}

        {opponentInfoProps.address !== zeroAddress && (
          <PlayerCard {...opponentInfoProps} />
        )}
      </div>
    </div>
  );
};

export default GameLobby;