import { Button } from "@mantine/core";
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";

const GameLobby = () => {
  const { playerJoined } = useGameContext();

  const { writeContract } = useWriteContract();
  const account = useAccount();

  return (
    <div>
      {account.address === playerJoined ? (
        <h2 className="font-bold text-2xl py-8">Waiting for opponent...</h2>
      ) : (
        <Button
          variant="filled"
          color="green"
          size="xl"
          radius="xl"
          type="button"
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "join",
              args: [],
            })
          }
        >
          Join a game!
        </Button>
      )}
    </div>
  );
};

export default GameLobby;