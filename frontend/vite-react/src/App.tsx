import { useAccount } from "wagmi";
import GameGrid from "./components/GameGrid";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  const account = useAccount();

  return (
    <div className="min-h-screen bg-[#002642] text-white">
      <div className="flex flex-col items-center">
        <Navbar />
        {account.status !== "connected" && (
          <Login/>
        )}
      </div>
      {account.status === "connected" && <GameGrid />}
    </div>
  );
}

export default App;
