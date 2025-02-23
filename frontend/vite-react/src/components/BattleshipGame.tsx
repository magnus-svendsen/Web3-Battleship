import { useAccount } from "wagmi";

import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameStartedEvent, PlayerJoinedEvent } from "../types/eventTypes";
import usePastEventValue from "../hooks/usePastEventValue";
import GameLobby from "./GameLobby";
import ShipPlacementBoard from "./ShipPlacementBoard";
import EnemyTerritory from "./EnemyTerritory";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";

const BattleshipGame = () => {
  const { playerJoined, setPlayerJoined, moveMessage, turnMessage } = useGameContext();

  const account = useAccount();

  const [gameStarted, setGameStarted] = useState(false);

  // (We no longer need playerData for joining the game)
  // const playerData = { grid: grid, hitsReceived: 0 };

  useWatchContractEventListener({
    eventName: "GameStarted",
    onEvent: (logs: GameStartedEvent[]) => {
      setGameStarted(logs[0].args.started ?? false);
    },
  });

  useWatchContractEventListener({
    eventName: "PlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      setPlayerJoined(logs[0].args.player ?? "");
    },
  });

  useEffect(() => {
    // DEBUGGING
    //account.address && console.log("Address of this player: ", account.address);
    playerJoined && console.log("Player joined:", playerJoined);
    //gameStarted && console.log("Game started!");
  }, [account.address, playerJoined, gameStarted]);

  const playerJoinedValue = usePastEventValue<string>(
    "PlayerJoined",
    (args) => args.player ?? "",
    ""
  );

  const gameStartedValue = usePastEventValue<boolean>(
    "GameStarted",
    (args) => args.started ?? false,
    false
  );

  useEffect(() => {
    setPlayerJoined(playerJoinedValue);
  }, [playerJoinedValue]);

  useEffect(() => {
    setGameStarted(gameStartedValue);
  }, [gameStartedValue]);

  return (
    <>
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
        <h2 className={`font-bold text-2xl flex justify-center mt-40 mb-10 ${moveMessage === "Opponent shot and hit!" ? "text-red-600" : ""} ${moveMessage === "You shot and hit!" ? "text-green-400" : ""}`}>{moveMessage}</h2>
        <div className="flex ">
          {gameStarted && <ShipPlacementBoard />}
          <EnemyTerritory />
        </div>
        <div className="font-bold text-2xl py-8 flex justify-center">
          <h2 className={`${turnMessage === "Your turn" ? "text-green-400" : ""}`}>{turnMessage}</h2>
        </div>
      </div>
    </>
  );
};

export default BattleshipGame;
