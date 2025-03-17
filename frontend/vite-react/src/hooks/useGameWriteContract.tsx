import { useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";

interface WriteContractParams {
  functionName: "join" | "move" | "placeShips" | "resetGame";
  args?: readonly [] | readonly [number, number] | readonly [readonly number[]];
}

const useGameWriteContract = () => {
  const { writeContract } = useWriteContract();

  // Destructure the parameter and assign a default empty array to args.
  const executeWriteContract = ({ functionName, args = [] }: WriteContractParams) => {
    return writeContract({
      abi,
      address: contractAddress,
      functionName,
      args,
    });
  };

  return executeWriteContract;
};

export default useGameWriteContract;
