import { useWatchContractEvent } from "wagmi";
import { contractAddress } from "../utils/contractAddress";
import { abi } from "../utils/abi";

interface WatchEventParams {
  eventName: "FirstPlayerJoined" | "SecondPlayerJoined" | "ShipPlacement" | "BothPlayersPlacedShips" | "MoveResult" | "GameReset";
  onEvent: (logs: any[]) => void;
}

const useWatchContractEventListener = ({ eventName, onEvent }: WatchEventParams) => {
  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName,
    onLogs(logs) {
      onEvent(logs);
    },
    onError(error) {
      console.error(`Error on event ${eventName}:`, error);
    },
  });
};

export default useWatchContractEventListener;