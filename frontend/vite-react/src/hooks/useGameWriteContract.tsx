import { useWriteContract } from "wagmi";
import { multiplayerContractAddress, singlePlayerContractAddress } from "../utils/contractAddress";
import { multiplayerAbi } from "../utils/abi/multiplayerAbi";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";
import type { GameMode } from "../types/gameTypes";

interface WriteContractParams {
  functionName: "join" | "move" | "aiMove" | "placeShips" | "resetGame" | "startGame"; 
  args?: readonly [] | readonly [number, number] | readonly [readonly number[]];
  mode?: GameMode;
}

const useGameWriteContract = () => {
  const { writeContract } = useWriteContract();

  // Destructure the parameter and assign default values
  const executeWriteContract = ({ 
    functionName, 
    args = [], 
    mode 
  }: WriteContractParams) => {
    // Select the appropriate ABI and address based on mode
    const abi = mode === "singleplayer" ? singlePlayerAbi : multiplayerAbi;
    const address = mode === "singleplayer" 
      ? singlePlayerContractAddress 
      : multiplayerContractAddress;

    return writeContract({
      abi,
      address,
      functionName,
      args,
    });
  };

  return executeWriteContract;
};

export default useGameWriteContract;