import { useWatchContractEvent } from "wagmi";
import { multiplayerContractAddress, singlePlayerContractAddress } from "../utils/contractAddress";
import { multiplayerAbi } from "../utils/abi/multiplayerAbi";
import type { GameMode } from "../types/gameTypes";
import { singlePlayerAbi } from "../utils/abi/singlePlayerAbi";

interface WatchEventParams {
  eventName: "FirstPlayerJoined" | "SecondPlayerJoined" | "ShipPlacement" | "BothPlayersPlacedShips" | "MoveResult" | "GameReset";
  onEvent: (logs: any[]) => void;
  mode?: GameMode;
}

const useWatchContractEventListener = ({ eventName, onEvent, mode }: WatchEventParams) => {
  const abi = mode === "singleplayer" ? singlePlayerAbi : multiplayerAbi;
  const address = mode === "singleplayer" ? singlePlayerContractAddress : multiplayerContractAddress;
  
  useWatchContractEvent({
    address,
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