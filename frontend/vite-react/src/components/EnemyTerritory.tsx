import type { GridData } from "../types/gridTypes";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { useGameContext } from "../contexts/GameContext";

import type {
  BothPlayersPlacedShipsEvent,
  MoveResultEvent,
  ShipPlacementEvent,
} from "../types/eventTypes";
import type { Coordinate } from "../types/coordinate";
import usePastEventValue from "../hooks/usePastEventValue";

const EnemyTerritory = () => {
  const {
    playerJoined,
    grid,
    moveMessage,
    setMoveMessage,
    turnMessage,
    setTurnMessage,
    shipPlacementPlayer,
    setShipPlacementPlayer,
    bothPlayersPlacedShips,
    setBothPlayersPlacedShips,
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
    eventName: "ShipPlacement",
    onEvent: (logs: ShipPlacementEvent[]) => {
      setShipPlacementPlayer(logs[0].args.player ?? "");
      if (grid) {
        localStorage.setItem("shipGrid", JSON.stringify(grid));
      }
    },
  });

  useWatchContractEventListener({
    eventName: "BothPlayersPlacedShips",
    onEvent: (logs: BothPlayersPlacedShipsEvent[]) => {
      setBothPlayersPlacedShips(logs[0].args.placed ?? false);
      if (playerJoined === account.address) {
        setTurnMessage("Your turn");
      } else {
        setTurnMessage("Opponent's turn");
      }
    },
  });

  useWatchContractEventListener({
    eventName: "MoveResult",
    onEvent: (logs: MoveResultEvent[]) => {
      const data = logs[0].args;
      if (typeof data.pos === "number") {
      } else {
        throw new Error("data.pos is undefined");
      }
      const coordinate = intToCoordinate(data.pos);

      if (data.player === account.address) {
        // Your move was made, so update enemy grid.
        if (data.hit === 2) {
          enemyGrid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("You shot and hit!");
        } else if (data.hit === 1) {
          enemyGrid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("You shot and missed!");
        }
        localStorage.setItem("enemyGrid", JSON.stringify(enemyGrid));
        localStorage.setItem("moveMessage", JSON.stringify(moveMessage));
        // After your move, it's your opponent's turn.
        setTurnMessage("Opponent's turn");
        localStorage.setItem("turnMessage", JSON.stringify(turnMessage));
      } else {
        // Opponent's move; update your grid.
        if (data.hit === 2) {
          grid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("Opponent shot and hit!");
        } else if (data.hit === 1) {
          grid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("Opponent shot and missed!");
        }
        localStorage.setItem("shipGrid", JSON.stringify(grid));
        localStorage.setItem("moveMessage", JSON.stringify(moveMessage));
        // After opponent's move, it's your turn.
        setTurnMessage("Your turn");
        localStorage.setItem("turnMessage", JSON.stringify(turnMessage));
      }
    },
  });

  const intToCoordinate = (value: number): Coordinate => {
    const x = Math.floor(value / 10);
    const y = value % 10;
    return { x, y };
  };

  const moveResultValue = usePastEventValue<{ pos: number; player: string; hit: number }>(
    "MoveResult",
    (args) => ({
      pos: args.pos,
      player: args.player,
      hit: args.hit,
    }),
    { pos: -1, player: "", hit: 0 }
  );

  useEffect(() => {
    console.log("moveResultValue", moveResultValue);
    if (moveResultValue?.player) {
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
    }
  }, [moveResultValue]);
  
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
    },
  });

  function colorByState(state: number) {
    if (state === 0) return "#050505";
    if (state === 1) return "#bb1010";
    if (state === 2) return "#ffffff";
    if (state === 3) return "#bb1010";
  }

  return (
    <div>
      {!bothPlayersPlacedShips ? (
        <div>
          {shipPlacementPlayer === account.address && (
            <h2>Waiting for opponent to place their ships...</h2>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: turnMessage === "Your turn" ? "auto" : "none",
              opacity: turnMessage === "Your turn" ? 1 : 0.5,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(10, 40px)",
                gap: "2px",
                backgroundColor: "#1212ab",
                padding: "2px",
              }}
            >
              {enemyGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${row}-${colIndex}`}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid black",
                      cursor: "pointer",
                      backgroundColor: colorByState(cell),
                    }}
                  >
                    <button
                      className=" cursor-pointer"
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnemyTerritory;
