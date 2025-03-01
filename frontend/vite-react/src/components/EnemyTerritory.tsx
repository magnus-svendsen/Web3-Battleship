import type { GridData } from "../types/gridTypes";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { useGameContext } from "../contexts/GameContext";

import type { MoveResultEvent } from "../types/eventTypes";
import type { Coordinate } from "../types/coordinate";

const EnemyTerritory = () => {
  const {
    grid,
    setGrid,
    setMoveMessage,
    turnMessage,
    setTurnMessage,
    shipPlacementPlayer,
    bothPlayersPlacedShips,
    setGameReset,
  } = useGameContext();

  const account = useAccount();
  const { writeContract } = useWriteContract();

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

  useWatchContractEventListener({
    eventName: "MoveResult",
    onEvent: (logs: MoveResultEvent[]) => {
      const data = logs[0].args;
      if (typeof data.pos !== "number") {
        throw new Error("data.pos is undefined");
      }
      const coordinate = intToCoordinate(data.pos);
      let updatedMoveMessage = "";
      let updatedTurnMessage = "";

      if (data.player === account.address) {
        // Your move was made, so update enemy grid.
        if (data.hit) {
          enemyGrid[coordinate.x][coordinate.y] = 3;
          updatedMoveMessage = "You shot and hit!";
        } else {
          enemyGrid[coordinate.x][coordinate.y] = 2;
          updatedMoveMessage = "You shot and missed!";
        }
        updatedTurnMessage = "Opponent's turn";
        setEnemyGrid(enemyGrid);
        localStorage.setItem("enemyGrid", JSON.stringify(enemyGrid));
      } else {
        // Opponent's move; update your grid.
        if (data.hit) {
          grid[coordinate.x][coordinate.y] = 3;
          updatedMoveMessage = "Opponent shot and hit!";
        } else {
          grid[coordinate.x][coordinate.y] = 2;
          updatedMoveMessage = "Opponent shot and missed!";
        }
        updatedTurnMessage = "Your turn";
        setGrid(grid);
        localStorage.setItem("grid", JSON.stringify(grid));
      }

      setMoveMessage(updatedMoveMessage);
      setTurnMessage(updatedTurnMessage);

      localStorage.setItem("moveMessage", JSON.stringify(updatedMoveMessage));
      localStorage.setItem("turnMessage", JSON.stringify(updatedTurnMessage));
    },
  });

  // On component mount, load saved event values from localStorage.
  useEffect(() => {
    const savedMoveMessage = localStorage.getItem("moveMessage");
    if (savedMoveMessage) {
      setMoveMessage(JSON.parse(savedMoveMessage));
    }
    const savedTurnMessage = localStorage.getItem("turnMessage");
    if (savedTurnMessage) {
      setTurnMessage(JSON.parse(savedTurnMessage));
    }
    const savedEnemyGrid = localStorage.getItem("enemyGrid");
    if (savedEnemyGrid) {
      setEnemyGrid(JSON.parse(savedEnemyGrid));
    }
    const savedGrid = localStorage.getItem("grid");
    if (savedGrid) {
      setGrid(JSON.parse(savedGrid));
    }
  }, []);

  const intToCoordinate = (value: number): Coordinate => {
    const x = Math.floor(value / 10);
    const y = value % 10;
    return { x, y };
  };

  useWatchContractEventListener({
    eventName: "GameOver",
    onEvent: (logs) => {
      const winner = logs[0].args.winner;
      // Check if the winner is the current account.
      setTurnMessage("");
      if (winner === account.address) {
        setMoveMessage("You won the game!");
      } else {
        setMoveMessage("You lost the game!");
      }
      setTimeout(() => {
        setGameReset(true);
      }, 5000);
    },
  });

  const colorByState = (cell: number) => {
    switch (cell) {
      case 0:
        return "bg-[#050505]";
      case 1:
        return "bg-[#bb1010]";
      case 2:
        return "bg-[#ffffff]";
      case 3:
        return "bg-[#bb1010]";
      default:
        return "bg-black";
    }
  };

  return (
    <div>
      {!bothPlayersPlacedShips ? (
        <div>
          {shipPlacementPlayer === account.address && (
            <h2>Waiting for opponent to place their ships...</h2>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-center ${
            turnMessage === "Your turn"
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-50"
          }`}
        >
          <div className="grid grid-cols-10 gap-0.5 bg-[#1212ab] p-0.5">
            {enemyGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${row}-${colIndex}`}
                  disabled={cell === 2 || cell === 3}
                  className={`flex items-center justify-center border border-black w-10 h-10 ${colorByState(cell)} ${cell !== 2 && cell !== 3 && "cursor-pointer hover:bg-slate-700"}`}
                  type="button"
                  onClick={() =>
                    writeContract({
                      abi,
                      address: contractAddress,
                      functionName: "move",
                      args: [rowIndex, colIndex],
                    })
                  }
                >
                  {cell === 2 || cell === 3 ? (
                    <span
                      style={{
                        color: "#000000",
                        fontSize: "30px",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      x
                    </span>
                  ) : (
                    <span>Fire</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnemyTerritory;
