import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { PlayerJoinedEvent } from "../types/eventTypes";
import GameLobby from "./GameLobby";
import ShipPlacementBoard from "./ShipPlacementBoard";
import EnemyTerritory from "./EnemyTerritory";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const BattleshipGame = () => {
  const account = useAccount();

  const {
    firstPlayerJoined,
    setFirstPlayerJoined,
    shipPlacementPlayer,
    bothPlayersPlacedShips,
    moveMessage,
    turnMessage,
  } = useGameContext();

  const [secondPlayerJoined, setSecondPlayerJoined] = useState<string>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showGameUnderway, setShowGameUnderway] = useState(false);

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

  const checkGameUnderway = () => {
    if (
      account.address !== firstPlayerJoined &&
      account.address !== secondPlayerJoined
    ) {
      setShowGameUnderway(true);
      localStorage.setItem("showGameUnderway", JSON.stringify(true));
    } else {
      setShowGameUnderway(false);
      localStorage.setItem("showGameUnderway", JSON.stringify(false));
    }
  };

  useEffect(() => {
    if (secondPlayerJoined) {
      checkGameUnderway();
      setGameStarted(true);
      localStorage.setItem("gameStarted", JSON.stringify(true));
    }
  }, [secondPlayerJoined]);

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
    const storedShowGameUnderway = localStorage.getItem("showGameUnderway");
    if (storedShowGameUnderway) {
      setShowGameUnderway(JSON.parse(storedShowGameUnderway));
    }
  }, []);

  return (
    <>
      {showGameUnderway ? (
        <h2 className="flex justify-center font-bold text-2xl py-20">
          Game already underway, please wait for the next game...
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
            className={`font-bold text-2xl flex justify-center mt-40 mb-10 ${moveMessage === "Opponent shot and hit!" || moveMessage === "You lost the game!" ? "text-red-600" : ""} ${moveMessage === "You shot and hit!" || moveMessage === "You won the game!" ? "text-green-400" : ""}`}
          >
            {moveMessage}
          </h2>
          <div className="flex">
            {gameStarted && <ShipPlacementBoard />}
            {bothPlayersPlacedShips && <EnemyTerritory />}
          </div>
          {!bothPlayersPlacedShips && (
            <div className="flex justify-center font-bold text-2xl py-6">
              {shipPlacementPlayer && (
                <div>
                  {shipPlacementPlayer === account.address ? (
                    <h2>Waiting for opponent to place their ships...</h2>
                  ) : (
                    <h2>Your opponent has placed their ships...</h2>
                  )}
                </div>
              )}
            </div>
          )}
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
