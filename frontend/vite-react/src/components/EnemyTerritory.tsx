import type { GridData } from "../types/gridTypes";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import { useGameContext } from "../contexts/GameContext";
import type { BothPlayersPlacedShipsEvent, MoveResultEvent, ShipPlacementEvent } from "../types/eventTypes";
import type { Coordinate } from "../types/coordinate";
import usePastEventValue from "../hooks/usePastEventValue";
import { Loader } from "@mantine/core";

const EnemyTerritory = () => {
  const { playerJoined, grid, setMoveMessage, turnMessage, setTurnMessage, setErrorMessage } = useGameContext();

  const account = useAccount();
  const { writeContract } = useWriteContract();
  const timeoutRef = useRef<number | null>(null);
  const [shipPlacementPlayer, setShipPlacementPlayer] = useState("");
  const [bothPlayersPlacedShips, setBothPlayersPlacedShips] = useState(false);
  const [loadingCell, setLoadingCell] = useState<{ row: number; col: number } | null>(null);
  const [enemyGrid] = useState<GridData>([
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
      if (typeof data.pos === 'number') { } else { throw new Error("data.pos is undefined") }
      const coordinate = intToCoordinate(data.pos);

      if (data.player === account.address) {
        // Your move was made, so update enemy grid.
        if (data.hit) {
          enemyGrid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("You shot and hit!");
        } else {
          enemyGrid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("You shot and missed!");
        }
        // After your move, it's your opponent's turn.
        setTurnMessage("Opponent's turn");
      } else {
        // Opponent's move; update your grid.
        if (data.hit) {
          grid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("Opponent shot and hit!");
        } else {
          grid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("Opponent shot and missed!");
        }
        // After opponent's move, it's your turn.
        setTurnMessage("Your turn");
      }
    }
  });

  const intToCoordinate = (value: number): Coordinate => {
    const x = Math.floor(value / 10);
    const y = value % 10;
    return { x, y }
  }




  const handleMoveTransaction = (rowIndex: number, colIndex: number) => {
    setLoadingCell({ row: rowIndex, col: colIndex });

    if (timeoutRef.current) {clearTimeout(timeoutRef.current)}

    timeoutRef.current = window.setTimeout(() => {
      setLoadingCell(null);
      setErrorMessage("Transaction timed out. Please try again.")
    }, 30000)
    
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: 'move',
        args: [rowIndex, colIndex],
      })
    } catch (error) {
      console.error('Transaction failed:', error);
    }
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
    }
  })

  const shipPlacementValue = usePastEventValue<string>(
    "ShipPlacement",
    (args) => args.player ?? "",
    ""
  );

  const bothPlayersPlacedShipsValue = usePastEventValue<boolean>(
    "BothPlayersPlacedShips",
    (args) => args.placed ?? false,
    false
  );

  const moveResultValue = usePastEventValue<{ pos: number; player: string; hit: boolean }>(
    "MoveResult",
    (args) => ({
      pos: args.pos,
      player: args.player,
      hit: args.hit,
    }),
    { pos: 0, player: "", hit: false }
  );

  useEffect(() => {
    setShipPlacementPlayer(shipPlacementValue);
  }, [shipPlacementValue]);

  useEffect(() => {
    setBothPlayersPlacedShips(bothPlayersPlacedShipsValue);
  }, [bothPlayersPlacedShipsValue]);

  useEffect(() => {
    if (loadingCell) {
      console.log("Resetting loader")
      setLoadingCell(null);
    }
  }, [turnMessage])

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
                        handleMoveTransaction(rowIndex, colIndex)
                      }
                      disabled={loadingCell !== null}
                    >
                      {loadingCell &&
                        loadingCell.row === rowIndex &&
                        loadingCell.col === colIndex ? (
                        <Loader size="md" />
                      ) : (
                        cell === 2 || cell === 3 ? (
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
                        )
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


