import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { GameStartedEvent, PlayerJoinedEvent } from "../types/eventTypes";
import GameLobby from "./GameLobby";
import ShipPlacementBoard from "./ShipPlacementBoard";
import EnemyTerritory from "./EnemyTerritory";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const BattleshipGame = () => {
  const account = useAccount();

  const { firstPlayerJoined, setFirstPlayerJoined, moveMessage, turnMessage } = useGameContext();

  const [secondPlayerJoined, setSecondPlayerJoined] = useState<string>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameUnderway, setShowGameUnderway] = useState(false);

  const checkGameUnderway = () => {
    if (
      firstPlayerJoined !== "0x0000000000000000000000000000000000000000" &&
      secondPlayerJoined !== "0x0000000000000000000000000000000000000000" &&
      account.address !== firstPlayerJoined &&
      account.address !== secondPlayerJoined
    ) {
      setShowGameUnderway(true);
      localStorage.setItem("showGameUnderway", JSON.stringify(true));
      window.location.reload();
    } else {
      setShowGameUnderway(false);
      localStorage.setItem("showGameUnderway", JSON.stringify(false));
    }
  };

  useWatchContractEventListener({
    eventName: "GameStarted",
    onEvent: (logs: GameStartedEvent[]) => {
      const started = logs[0].args.started ?? false;
      setGameStarted(started);
      localStorage.setItem("gameStarted", JSON.stringify(started));
      checkGameUnderway();
    },
  });

  useWatchContractEventListener({
    eventName: "FirstPlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";
      setFirstPlayerJoined(player);
      localStorage.setItem("firstPlayerJoined", JSON.stringify(player));
    },
  });

  useWatchContractEventListener({
    eventName: "SecondPlayerJoined",
    onEvent: (logs: PlayerJoinedEvent[]) => {
      const player = logs[0].args.player ?? "";
      setSecondPlayerJoined(player);
      localStorage.setItem("secondPlayerJoined", JSON.stringify(player));
    },
  });

  useEffect(() => {
    const storedGameStarted = localStorage.getItem("gameStarted");
    if (storedGameStarted) {
      setGameStarted(JSON.parse(storedGameStarted));
    }
    const storedFirstPlayerJoined = localStorage.getItem("firstPlayerJoined");
    if (storedFirstPlayerJoined) {
      setFirstPlayerJoined(JSON.parse(storedFirstPlayerJoined));
    }
    const storedSecondPlayerJoined = localStorage.getItem("secondPlayerJoined");
    if (storedSecondPlayerJoined) {
      setSecondPlayerJoined(JSON.parse(storedSecondPlayerJoined));
    }
  }, []);

  return (
    <>
      {showGameUnderway ? (
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
