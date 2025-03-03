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

  return (
    <div className="pt-4 pb-12 flex justify-between w-full">
      <h2 className="font-bold text-2xl ml-3">Web3 Battleship</h2>
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
