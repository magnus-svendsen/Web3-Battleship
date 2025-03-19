import { useWriteContract } from "wagmi";
import { multiplayerContractAddress } from "../utils/contractAddress";
import { multiplayerAbi } from "../utils/abi/multiplayerAbi";

interface WriteContractParams {
  functionName: "join" | "move" | "placeShips" | "resetGame";
  args?: readonly [] | readonly [number, number] | readonly [readonly number[]];
}

const useGameWriteContract = () => {
  const { writeContract } = useWriteContract();

  // Destructure the parameter and assign a default empty array to args.
  const executeWriteContract = ({ functionName, args = [] }: WriteContractParams) => {
    return writeContract({
      abi: multiplayerAbi,
      address: multiplayerContractAddress,
      functionName,
      args,
    });
  };

  return executeWriteContract;
};

export default useGameWriteContract;
