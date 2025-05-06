import { useGameContext } from "../contexts/GameContext";
import GameLobby from "./GameLobby";
import ShipPlacement from "./ShipPlacement";
import EnemyTerritory from "./EnemyTerritory";
import { useAccount } from "wagmi";
import GameStatsBox from "./GameStatsBox";

const Multiplayer = () => {
  const account = useAccount();

  const {
    gameStarted,
    showGameUnderway,
    shipPlacementPlayer,
    bothPlayersPlacedShips,
    moveMessage,
    turnMessage,
  } = useGameContext();

  return (
    <div className="flex justify-center items-center">
      {showGameUnderway ? (
        <h2 className="flex justify-center font-bold text-2xl py-20">
          Game already underway, please wait for the next game...
        </h2>
      ) : (
        <div className="flex flex-col items-center gap-2.5">
          {!gameStarted && <GameLobby />}
          <h2
            className={`font-bold text-2xl flex justify-center mt-40 mb-10 ${
              moveMessage === "Opponent shot and hit!" ||
              moveMessage === "You lost the game!"
                ? "text-[rgb(220,60,60)]"
                : ""
            } ${
              moveMessage === "You shot and hit!" ||
              moveMessage === "You won the game!"
                ? "text-[rgb(0,200,100)]"
                : ""
            }`}
          >
            {moveMessage}
          </h2>
          <div className="flex">
            {bothPlayersPlacedShips && <GameStatsBox/>}
            {gameStarted && <ShipPlacement />}
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
              className={`${turnMessage === "Your turn" ? "text-[rgb(0,200,100)]" : ""}`}
            >
              {turnMessage}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
