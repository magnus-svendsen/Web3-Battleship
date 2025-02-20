// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { GridData } from "../types/gridTypes";

// Define the shape of our game context.
interface GameContextType {
  grid: GridData;
  setGrid: React.Dispatch<React.SetStateAction<GridData>>;
  playerJoined: string;
  setPlayerJoined: React.Dispatch<React.SetStateAction<string>>;
  moveMessage: string;
  setMoveMessage: React.Dispatch<React.SetStateAction<string>>;
  turnMessage: string;
  setTurnMessage: React.Dispatch<React.SetStateAction<string>>;
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
  const [playerJoined, setPlayerJoined] = useState<string>("");
  const [moveMessage, setMoveMessage] = useState<string>("");
  const [turnMessage, setTurnMessage] = useState<string>("");

  // Provide all state values and setters.
  return (
    <GameContext.Provider
      value={{
        grid,
        setGrid,
        playerJoined,
        setPlayerJoined,
        moveMessage,
        turnMessage,
        setMoveMessage,
        setTurnMessage,
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
