import { useAccount } from "wagmi";
import BattleshipGame from "./components/BattleshipGame";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { GameProvider } from "./contexts/GameContext";

function App() {
  const account = useAccount();

  return (
    <GameProvider>
      <div className="min-h-screen bg-[#002642] text-white">
        <div className="flex flex-col items-center">
          <Navbar />
          {account.status !== "connected" && (
            <Login/>
          )}
        </div>
        {account.status === "connected" && <BattleshipGame />}
      </div>
    </GameProvider>
  );
}

export default App;
