import { useWatchContractEvent } from "wagmi";
import { multiplayerContractAddress } from "../utils/contractAddress";
import { multiplayerAbi } from "../utils/abi/multiplayerAbi";

interface WatchEventParams {
  eventName: "FirstPlayerJoined" | "SecondPlayerJoined" | "ShipPlacement" | "BothPlayersPlacedShips" | "MoveResult" | "GameReset";
  onEvent: (logs: any[]) => void;
}

const useWatchContractEventListener = ({ eventName, onEvent }: WatchEventParams) => {
  useWatchContractEvent({
    address: multiplayerContractAddress,
    abi: multiplayerAbi,
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