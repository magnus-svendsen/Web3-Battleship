import { useAccount } from "wagmi";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ErrorDialog from "./components/ErrorDialog";
import GameLobby from "./components/GameLobby";
import ShipPlacement from "./components/ShipPlacement";
import EnemyTerritory from "./components/EnemyTerritory";
import TransactionConfirmationModal from "./components/TransactionConfirmationModal";
import { useGameContext } from "./contexts/GameContext";
import GameStatsBox from "./components/GameStatsBox";
import Footer from "./components/Footer";
import NewUserInformation from "./components/NewUserInformation";

function App() {
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
    <div className="min-h-screen bg-[#002642] text-white">
      <Navbar />
      <div className="flex flex-col items-center">
        {account.status !== "connected" && <><Login /><NewUserInformation /></>}
      </div>

      {account.status === "connected" && (
        <>
          <TransactionConfirmationModal />
          {showGameUnderway ? (
            <h2 className="flex justify-center font-bold text-2xl py-20">
              Game already underway, please wait for the next game...
            </h2>
          ) : (
            <div className="flex flex-col items-center gap-2.5 mt-[60px]">
              {!gameStarted && <GameLobby />}
              <h2
                className={`font-bold text-2xl flex justify-center mt-40 mb-10 ${moveMessage === "Opponent shot and hit!" ||
                    moveMessage === "You lost the game!"
                    ? "text-red-600"
                    : ""
                  } ${moveMessage === "You shot and hit!" ||
                    moveMessage === "You won the game!"
                    ? "text-green-400"
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
                        <h2>
                          Waiting for opponent to place their ships...
                        </h2>
                      ) : (
                        <h2>Your opponent has placed their ships...</h2>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="font-bold text-2xl py-8 flex justify-center">
                <h2 className={`${turnMessage === "Your turn" ? "text-green-400" : ""}`}>
                  {turnMessage}
                </h2>
              </div>
            </div>
          )}
          <Footer/>
        </>
      )}
      <ErrorDialog />
    </div>
  );
}

export default App;
