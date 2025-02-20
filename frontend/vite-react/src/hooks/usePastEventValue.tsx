// src/hooks/usePastEventValue.ts
import { useEffect, useState } from "react";
import { usePublicClient, useReadContract } from "wagmi";
import { contractAddress } from "../utils/contractAddress";
import { abi } from "../utils/abi";

type EventName = "BothPlayersPlacedShips" | "GameOver" | "GameReset" | "GameStarted" | "MoveResult" | "PlayerJoined" | "ShipPlacement";

function usePastEventValue<T>(
  eventName: EventName,
  mapFn: (args: any) => T,
  defaultValue: T,
  fromBlock?: number | bigint
): T {
  const publicClient = usePublicClient();
  // Read current gameId from the contract
  const currentGameId = useReadContract({
    address: contractAddress,
    abi,
    functionName: "gameId",
  });

  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const startBlock = fromBlock ? BigInt(fromBlock) : latestBlock - BigInt(500);
        const events = await publicClient.getContractEvents({
          address: contractAddress,
          abi,
          eventName,
          fromBlock: startBlock,
          toBlock: "latest",
        });
        // Filter events by current gameId if the event has a gameId argument.
        const filtered = events.filter(
          (event) => {
            if ('gameId' in event.args) {
              return event.args.gameId === currentGameId.data;
            }
            if ('newGameId' in event.args) {
              return event.args.newGameId === currentGameId.data;
            }
            return false;
          }
        );
        if (filtered.length > 0) {
          const latestEvent = filtered[filtered.length - 1];
          setValue(mapFn(latestEvent.args));
        }
      } catch (error) {
        console.error(`Error fetching ${eventName} events:`, error);
      }
    };

    if ((currentGameId.data ?? 0) > 0) {
      fetchEvents();
    }
  }, [currentGameId.data, publicClient]);

  return value;
}

export default usePastEventValue;
