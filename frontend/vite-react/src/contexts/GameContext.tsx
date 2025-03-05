// src/contexts/GameContext.tsx
import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react"
import type { GridData } from "../types/gridTypes";

// Define the shape of our game context.
interface GameContextType {
  grid: GridData;
  setGrid: React.Dispatch<React.SetStateAction<GridData>>;
  firstPlayerJoined: string;
  setFirstPlayerJoined: React.Dispatch<React.SetStateAction<string>>;
  secondPlayerJoined: string;
  setSecondPlayerJoined: React.Dispatch<React.SetStateAction<string>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  showGameUnderway: boolean;
  setShowGameUnderway: React.Dispatch<React.SetStateAction<boolean>>;
  shipPlacementPlayer: string;
  setShipPlacementPlayer: React.Dispatch<React.SetStateAction<string>>;
  bothPlayersPlacedShips: boolean;
  setBothPlayersPlacedShips: React.Dispatch<React.SetStateAction<boolean>>;
  moveMessage: string;
  setMoveMessage: React.Dispatch<React.SetStateAction<string>>;
  turnMessage: string;
  setTurnMessage: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  gameReset: boolean;
  setGameReset: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value (which will be overridden by the provider).
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component.
export const GameProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state variables
  const [grid, setGrid] = useState<GridData>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [firstPlayerJoined, setFirstPlayerJoined] = useState<string>("");
  const [secondPlayerJoined, setSecondPlayerJoined] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showGameUnderway, setShowGameUnderway] = useState(false);
  const [shipPlacementPlayer, setShipPlacementPlayer] = useState<string>("");
  const [bothPlayersPlacedShips, setBothPlayersPlacedShips] = useState<boolean>(false);
  const [moveMessage, setMoveMessage] = useState<string>("");
  const [turnMessage, setTurnMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gameReset, setGameReset] = useState<boolean>(false);

  // Provide all state values and setters.
  return (
    <GameContext.Provider
      value={{
        grid,
        setGrid,
        firstPlayerJoined,
        setFirstPlayerJoined,
        secondPlayerJoined,
        setSecondPlayerJoined,
        gameStarted,
        setGameStarted,
        showGameUnderway,
        setShowGameUnderway,
        shipPlacementPlayer,
        setShipPlacementPlayer,
        bothPlayersPlacedShips,
        setBothPlayersPlacedShips,
        moveMessage,
        turnMessage,
        setMoveMessage,
        setTurnMessage,
        errorMessage,
        setErrorMessage,
        gameReset,
        setGameReset,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Create a custom hook for consuming the GameContext.
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
