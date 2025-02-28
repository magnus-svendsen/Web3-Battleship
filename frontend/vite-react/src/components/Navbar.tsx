import { Button, Loader } from "@mantine/core";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { GameResetEvent } from "../types/eventTypes";
import { useRef, useState } from "react";
import { useGameContext } from "../contexts/GameContext";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const timeoutRef = useRef<number | null>(null);
  const {errorMessage, setErrorMessage} = useGameContext()
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

  const handleGameReset = () => {
    setIsLoading(true)
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false)
      timeoutRef.current = null;
    }, 20000); // 20sec timeout if no transaction is validated


    writeContract({
      abi,
      address: contractAddress,
      functionName: "resetGame",
      args: [],
    })
  }

  function testError(): void {
    setErrorMessage("Error: Noe feil skjedde")
  }

  return (
    <div className="pt-4 pb-12 flex justify-between w-full">
      <h2 className="font-bold text-2xl ml-1">Web3 Battleship</h2>
      {account.status === "connected" && (
        <div className="flex">
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
            > <Loader></Loader>
            </Button>
            :
            <><Button
              variant="red"
              color="teal"
              size="sm"
              radius="sm"
              className="mr-2"
              type="button"
              onClick={() => handleGameReset()}
            >
              Reset game
            </Button>
              <Button
              onClick={() => testError()}>
                Test error message
              </Button></>
          }
        </div>
      )}
    </div>
  );
};

export default Navbar;
