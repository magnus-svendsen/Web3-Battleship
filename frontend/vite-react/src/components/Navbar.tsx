import { Button } from "@mantine/core";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

  const [gameReset, setGameReset] = useState<boolean>(false);

  useWatchContractEventListener({
    eventName: "GameReset",
    onEvent: (logs: any) => {
      console.log("GameReset event detected:", logs[0].args);
      // When the event is detected, set gameReset to true.
      setGameReset(true);
    },
  });

  useEffect(() => {
    if (gameReset) {
      // Trigger a page refresh when gameReset becomes true.
      window.location.reload();
    }
  }, [gameReset]);

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

          <Button
            variant="red"
            color="teal"
            size="sm"
            radius="sm"
            className="mr-2"
            type="button"
            onClick={() =>
              writeContract({
                abi,
                address: contractAddress,
                functionName: "resetGame",
                args: [],
              })
            }
          >
            Reset game
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
