import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameStartedEvent, PlayerJoinedEvent } from "../types/eventTypes";
import GameLobby from "./GameLobby";
import ShipPlacementBoard from "./ShipPlacementBoard";
import EnemyTerritory from "./EnemyTerritory";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress } from "../utils/contractAddress";
import { abi } from "../utils/abi";

const BattleshipGame = () => {
  const account = useAccount();

  const { setPlayerJoined, moveMessage, turnMessage } = useGameContext();

  const [gameStarted, setGameStarted] = useState(false);

  useWatchContractEventListener({
    eventName: "GameStarted",
    onEvent: (logs: GameStartedEvent[]) => {
      const started = logs[0].args.started ?? false;
      setGameStarted(started);
      localStorage.setItem("gameStarted", JSON.stringify(started));
    },
  });

  useWatchContractEventListener({
    eventName: "PlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";
      setPlayerJoined(player);
      localStorage.setItem("playerJoined", JSON.stringify(player));
    },
  });

  useEffect(() => {
    const storedGameStarted = localStorage.getItem("gameStarted");
    if (storedGameStarted) {
      setGameStarted(JSON.parse(storedGameStarted));
    }
    const storedPlayerJoined = localStorage.getItem("playerJoined");
    if (storedPlayerJoined) {
      setPlayerJoined(JSON.parse(storedPlayerJoined));
    }
  }, []);

  const player1 = useReadContract({
    address: contractAddress,
    abi,
    functionName: "player1",
  });

  const player2 = useReadContract({
    address: contractAddress,
    abi,
    functionName: "player2",
  });

  const isGameUnderway =
    player1.data !== "0x0000000000000000000000000000000000000000" &&
    player2.data !== "0x0000000000000000000000000000000000000000";

  const shouldShowUnderwayMessage =
    isGameUnderway &&
    account.address !== player1.data &&
    account.address !== player2.data;

  return (
    <>
      {shouldShowUnderwayMessage ? (
        <h2 className="flex justify-center font-bold text-2xl py-20">
          Game already underway, please wait for the next game.
        </h2>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginTop: "60px",
          }}
        >
          {!gameStarted && <GameLobby />}
          <h2
            className={`font-bold text-2xl flex justify-center mt-40 mb-10 ${moveMessage === "Opponent shot and hit!" ? "text-red-600" : ""} ${moveMessage === "You shot and hit!" ? "text-green-400" : ""}`}
          >
            {moveMessage}
          </h2>
          <div className="flex ">
            {gameStarted && <ShipPlacementBoard />}
            <EnemyTerritory />
          </div>
          <div className="font-bold text-2xl py-8 flex justify-center">
            <h2
              className={`${turnMessage === "Your turn" ? "text-green-400" : ""}`}
            >
              {turnMessage}
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default BattleshipGame;
