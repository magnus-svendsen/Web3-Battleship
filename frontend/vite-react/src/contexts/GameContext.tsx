// src/contexts/GameContext.tsx
import type React from "react";
import { createContext, useContext, useRef, useState, type ReactNode } from "react"
import type { GridData } from "../types/gridTypes";
import type { PlayerCardProps } from "../types/playerCardProps";
import { zeroAddress } from "viem";

// Define the shape of our game context.
interface GameContextType {
  mode: "none" | "singleplayer" | "multiplayer";
  setMode: React.Dispatch<React.SetStateAction<"none" | "singleplayer" | "multiplayer">>;
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
  firstPlayerJoined: string | null;
  setFirstPlayerJoined: React.Dispatch<React.SetStateAction<string | null>>;
  secondPlayerJoined: string | null;
  setSecondPlayerJoined: React.Dispatch<React.SetStateAction<string | null>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  showGameUnderway: boolean;
  setShowGameUnderway: React.Dispatch<React.SetStateAction<boolean>>;
  shipPlacementPlayer: string | null;
  setShipPlacementPlayer: React.Dispatch<React.SetStateAction<string | null>>;
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
  singlePlayerJoined: string | null;
  setSinglePlayerJoined: React.Dispatch<React.SetStateAction<string | null>>;
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
  opponentInfoProps: PlayerCardProps;
  setOpponentInfoProps: React.Dispatch<React.SetStateAction<PlayerCardProps>>;
  playerInfoProps: PlayerCardProps;
  setPlayerInfoProps: React.Dispatch<React.SetStateAction<PlayerCardProps>>;
}

// Create the context with a default value (which will be overridden by the provider).
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component.
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"none" | "singleplayer" | "multiplayer">(localStorage.getItem("mode") as "none" | "singleplayer" | "multiplayer" || "none");
  
  // Initialize state variables
  const [grid, setGrid] = useState<GridData>(() => {
    const savedGrid = localStorage.getItem("grid");
    return savedGrid ? JSON.parse(savedGrid) : [
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
    ];
  });
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
  const [enemyGrid, setEnemyGrid] = useState<GridData>(() => {
    const savedEnemyGrid = localStorage.getItem("enemyGrid");
    return savedEnemyGrid ? JSON.parse(savedEnemyGrid) : [
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
    ];  
  });
  const [placedShips, setPlacedShips] = useState<boolean[]>(() => {
    const savedPlacedShips = localStorage.getItem("placedShips");
    return savedPlacedShips ? JSON.parse(savedPlacedShips) : [false, false, false, false, false];
  });
  const [shipPositions, setShipPositions] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [shipOrientations, setShipsOrientations] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [firstPlayerJoined, setFirstPlayerJoined] = useState<string | null>(localStorage.getItem("firstPlayerJoined"));
  const [secondPlayerJoined, setSecondPlayerJoined] = useState<string | null>(localStorage.getItem("secondPlayerJoined"));
  const [gameStarted, setGameStarted] = useState<boolean>(localStorage.getItem("gameStarted") === "true");
  const [showGameUnderway, setShowGameUnderway] = useState<boolean>(localStorage.getItem("showGameUnderway") === "true");
  const [shipPlacementPlayer, setShipPlacementPlayer] = useState<string | null>(localStorage.getItem("shipPlacementPlayer"));
  const [bothPlayersPlacedShips, setBothPlayersPlacedShips] = useState<boolean>(localStorage.getItem("bothPlayersPlacedShips") === "true");
  const [moveMessage, setMoveMessage] = useState<string>("");
  const [turnMessage, setTurnMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gameReset, setGameReset] = useState<boolean>(false);
  
  const moveResultTimeoutRef = useRef<number | null>(null);
  const [autoConfirmTransactions, setAutoConfirmTransactions] = useState<boolean>(false);
  const [transactionCancelCount, setTransactionCancelCount] = useState<number>(0)

  const [singlePlayerJoined, setSinglePlayerJoined] = useState<string | null>(
    localStorage.getItem("singlePlayerJoined")
  );
  const [timesHit, setTimesHit] = useState<number>(Number(localStorage.getItem("timesHit")) || 0);
  const [timesMiss, setTimesMiss] = useState<number>(Number(localStorage.getItem("timesMiss")) || 0);
  const [enemyTimesHit, setEnemyTimesHit] = useState<number>(Number(localStorage.getItem("enemyTimesHit")) || 0);
  const [enemyTimesMiss, setEnemyTimesMiss] = useState<number>(Number(localStorage.getItem("enemyTimesMiss")) || 0);
  const [turnNumber, setTurnNumber] = useState<number>(Number(localStorage.getItem("turnNumber")) || 0);
  const [opponentInfoProps, setOpponentInfoProps] = useState<PlayerCardProps>({ address: zeroAddress, isOpponent: true });
  const [playerInfoProps, setPlayerInfoProps] = useState<PlayerCardProps>({ address: zeroAddress, isOpponent: false });

  // Provide all state values and setters.
  return (
    <GameContext.Provider
      value={{
        mode,
        setMode,
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
        singlePlayerJoined,
        setSinglePlayerJoined,
        timesHit,
        setTimesHit,
        timesMiss,
        setTimesMiss,
        enemyTimesHit,
        setEnemyTimesHit,
        enemyTimesMiss,
        setEnemyTimesMiss,
        turnNumber,
        setTurnNumber,
        opponentInfoProps,
        setOpponentInfoProps,
        playerInfoProps,
        setPlayerInfoProps
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
