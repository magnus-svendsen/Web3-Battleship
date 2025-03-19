import { useAccount } from "wagmi";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ErrorDialog from "./components/ErrorDialog";

import TransactionConfirmationModal from "./components/TransactionConfirmationModal";
import { useState } from "react";
import { Button } from "@mantine/core";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import Multiplayer from "./components/Multiplayer";
import SinglePlayer from "./components/SinglePlayer";

function App() {
  const account = useAccount();

  const [showSinglePlayerGame, setShowSinglePlayerGame] = useState<boolean>(localStorage.getItem("showSinglePlayerGame") === "true");
  const [showMultiplayerGame, setShowMultiplayerGame] = useState<boolean>(localStorage.getItem("showMultiplayerGame") === "true");

  return (
    <div className="min-h-screen bg-[#002642] text-white">
      <Navbar />
      <div className="flex flex-col items-center">
        {account.status !== "connected" && <Login />}
      </div>

      {account.status === "connected" && (
        <>
          {!showSinglePlayerGame && !showMultiplayerGame && (
            <div className="flex justify-center gap-5 mt-20">
              <Button
                onClick={() => { 
                  setShowSinglePlayerGame(true); 
                  localStorage.setItem("showSinglePlayerGame", JSON.stringify(true)); 
                }}
                className="mt-5"
                size="xl"
                color="red"
                radius="xl"
              >
                <PersonIcon className="mr-0.5" />
                Single Player
              </Button>

              <Button
                onClick={() => {
                  setShowMultiplayerGame(true)
                  localStorage.setItem("showMultiplayerGame", JSON.stringify(true));
                }}
                className="mt-5"
                size="xl"
                color="blue"
                radius="xl"
              >
                <GroupIcon className="mr-1" />
                Multiplayer
              </Button>
            </div>
          )}

          {showSinglePlayerGame && (
            <div className="">
              <Button
                onClick={() => {
                  setShowSinglePlayerGame(false);
                  localStorage.setItem("showSinglePlayerGame", JSON.stringify(false));
                }}
                className=""
                size="xl"
                color="red"
                radius="xl"
              >
                Back
              </Button>
              <SinglePlayer />
            </div>
          )}

          {showMultiplayerGame && (
            <div className="">
              <Button
                onClick={() => {
                  setShowMultiplayerGame(false);
                  localStorage.setItem("showMultiplayerGame", JSON.stringify(false));
                }}
                className=""
                size="xl"
                color="blue"
                radius="xl"
              >
                Back
              </Button>
              <Multiplayer />
            </div>
          )}
        </>
      )}
      <TransactionConfirmationModal />
      <ErrorDialog />
    </div>
  );
}

export default App;
