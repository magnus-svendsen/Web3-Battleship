import { useAccount } from "wagmi";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ErrorDialog from "./components/ErrorDialog";

import TransactionConfirmationModal from "./components/TransactionConfirmationModal";
import { useEffect } from "react";
import { Button } from "@mantine/core";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import Multiplayer from "./components/Multiplayer";
import SinglePlayer from "./components/SinglePlayer";
import { useGameContext } from "./contexts/GameContext";
import Footer from "./components/Footer";
import NewUserInformation from "./components/NewUserInformation";
import Header from "./components/Header";

function App() {
  const account = useAccount();

  const { mode, setMode } = useGameContext();

  // On component mount, load saved event values from localStorage.
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode) {
      setMode(JSON.parse(savedMode));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#002642] text-white flex flex-col">
      <Navbar />
      <main className={`flex-1 flex flex-col items-center justify-center ${account.status === "connected" ? "-mt-20" : ""}`}>
        {account.status !== "connected" && (
          <div className="flex flex-col items-center justify-center">
            <Header />
            <Login />
            <NewUserInformation />
          </div>
        )}

        {account.status === "connected" && (
          <div className="flex flex-col items-center justify-center">
            {mode === "none" && (
              <div className="flex justify-center gap-12">
                <Button
                  onClick={() => {
                    setMode("singleplayer");
                    localStorage.setItem("mode", JSON.stringify("singleplayer"));
                  }}
                  size="xl"
                  color="red"
                  radius="xl"
                >
                  <PersonIcon className="mr-0.5" />
                  Single Player
                </Button>

                <Button
                  onClick={() => {
                    setMode("multiplayer");
                    localStorage.setItem("mode", JSON.stringify("multiplayer"));
                  }}
                  size="xl"
                  color="blue"
                  radius="xl"
                >
                  <GroupIcon className="mr-1" />
                  Multiplayer
                </Button>
              </div>
            )}

            {mode === "singleplayer" && <SinglePlayer />}
            {mode === "multiplayer" && <Multiplayer />}
          </div>
        )}
      </main>
      {account.status === "connected" && <Footer />}
      <TransactionConfirmationModal />
      <ErrorDialog />
    </div>
  );
}

export default App;
