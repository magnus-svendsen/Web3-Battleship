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
    <div className="flex flex-col items-center w-full">
      {showGameUnderway ? (
        <h2 className="font-bold text-2xl">
          Game already underway, please wait for the next game...
        </h2>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {!gameStarted && <GameLobby />}
          <h2
            className={`font-bold text-2xl ${
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
          <div className="flex items-center gap-8">
            {bothPlayersPlacedShips && <GameStatsBox />}
            {gameStarted && <ShipPlacement />}
            {bothPlayersPlacedShips && <EnemyTerritory />}
          </div>
          <div className="flex justify-center">
            <h2
              className={`text-2xl font-bold ${
                turnMessage === "Your turn" ? "text-[rgb(0,200,100)]" : ""
              } ${
                turnMessage === "Opponent's turn" ? "text-[rgb(220,60,60)]" : ""
              }`}
            >
              {turnMessage}
            </h2>
          </div>
          {!bothPlayersPlacedShips && (
            <div className="flex justify-center font-bold text-2xl">
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
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
