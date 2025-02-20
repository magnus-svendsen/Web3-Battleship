import { Button } from "@mantine/core";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";

const Navbar = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract } = useWriteContract();

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
