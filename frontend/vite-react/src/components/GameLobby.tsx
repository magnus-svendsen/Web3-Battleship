import { Button } from "@mantine/core";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useGameContext } from "../contexts/GameContext";
import PersonIcon from '@mui/icons-material/Person';

const GameLobby = () => {
  const { firstPlayerJoined } = useGameContext();

  const { writeContract } = useWriteContract();
  const account = useAccount();

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
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "join",
              args: [],
            })
          }
        >
          {firstPlayerJoined ? (
            <div className="flex gap-2">
              <div className="flex ">
                <div className="mt-0.5">
                  1 
                </div>
                <div className="">
                  <PersonIcon />
                </div>
              </div>
              <div className="mt-0.5">
                Join a game!
              </div>
            </div>
          ) : (
            <>Join a game!</>
          )}
        </Button>
      )}
    </div>
  );
};

export default GameLobby;