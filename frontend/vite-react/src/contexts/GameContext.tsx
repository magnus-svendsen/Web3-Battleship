// src/contexts/GameContext.tsx
import type React from "react";
import { createContext, useContext, useRef, useState, type ReactNode } from "react"
import type { GridData } from "../types/gridTypes";

// Define the shape of our game context.
interface GameContextType {
  grid: GridData;
  setGrid: React.Dispatch<React.SetStateAction<GridData>>;
  tempGrid: GridData;
  setTempGrid: React.Dispatch<React.SetStateAction<GridData>>;
  enemyGrid: GridData;
  setEnemyGrid: React.Dispatch<React.SetStateAction<GridData>>;
  placedShips: boolean[];
  setPlacedShips: React.Dispatch<React.SetStateAction<boolean[]>>;
  shipPositions: number[];
  setShipPositions: React.Dispatch<React.SetStateAction<number[]>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  shipOrientations: boolean[];
  setShipsOrientations: React.Dispatch<React.SetStateAction<boolean[]>>;
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
  moveResultTimeoutRef: React.MutableRefObject<number | null>;
  autoConfirmTransactions: boolean;
  setAutoConfirmTransactions: React.Dispatch<React.SetStateAction<boolean>>;
  transactionCancelCount: number;
  setTransactionCancelCount: React.Dispatch<React.SetStateAction<number>>;
  timesHit: number;
  setTimesHit: React.Dispatch<React.SetStateAction<number>>;
  timesMiss: number;
  setTimesMiss: React.Dispatch<React.SetStateAction<number>>;
  enemyTimesHit: number;
  setEnemyTimesHit: React.Dispatch<React.SetStateAction<number>>;
  enemyTimesMiss: number;
  setEnemyTimesMiss: React.Dispatch<React.SetStateAction<number>>;
  turnNumber: number;
  setTurnNumber: React.Dispatch<React.SetStateAction<number>>;
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
  const [tempGrid, setTempGrid] = useState<GridData>([
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
  const [enemyGrid, setEnemyGrid] = useState<GridData>([
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
  const [placedShips, setPlacedShips] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [shipPositions, setShipPositions] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [shipOrientations, setShipsOrientations] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
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
  
  const moveResultTimeoutRef = useRef<number | null>(null);
  const [autoConfirmTransactions, setAutoConfirmTransactions] = useState<boolean>(false);
  const [transactionCancelCount, setTransactionCancelCount] = useState<number>(0)
  const [timesHit, setTimesHit] = useState<number>(0);
  const [timesMiss, setTimesMiss] = useState<number>(0);
  const [enemyTimesHit, setEnemyTimesHit] = useState<number>(0);
  const [enemyTimesMiss, setEnemyTimesMiss] = useState<number>(0);
  const [turnNumber, setTurnNumber] = useState<number>(0);

  // Provide all state values and setters.
  return (
    <GameContext.Provider
      value={{
        grid,
        setGrid,
        tempGrid,
        setTempGrid,
        enemyGrid,
        setEnemyGrid,
        placedShips,
        setPlacedShips,
        shipPositions,
        setShipPositions,
        isDragging,
        setIsDragging,
        shipOrientations,
        setShipsOrientations,
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
        moveResultTimeoutRef,
        autoConfirmTransactions,
        setAutoConfirmTransactions,
        transactionCancelCount,
        setTransactionCancelCount,
        timesHit,
        setTimesHit,
        timesMiss,
        setTimesMiss,
        enemyTimesHit,
        setEnemyTimesHit,
        enemyTimesMiss,
        setEnemyTimesMiss,
        turnNumber,
        setTurnNumber
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
