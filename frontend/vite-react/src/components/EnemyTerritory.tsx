import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGameContext } from "../contexts/GameContext";
import { Loader } from "@mantine/core";
import useGameWriteContract from "../hooks/useGameWriteContract";
import { useMoveResultListener } from "../hooks/useMoveResultListener";

const EnemyTerritory = () => {
  const account = useAccount();

  const {
    enemyGrid,
    mode,
    setMoveMessage,
    turnMessage,
    setTurnMessage,
    shipPlacementPlayer,
    bothPlayersPlacedShips,
    setErrorMessage,
    moveResultTimeoutRef,
    transactionCancelCount
  } = useGameContext();

  useMoveResultListener(mode);

  const executeWriteContract = useGameWriteContract();
  
  const [loadingCell, setLoadingCell] = useState<{ row: number; col: number } | null>(null);

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
  }, []);

  useEffect(() => {
    setLoadingCell(null);
    if (moveResultTimeoutRef.current) {
      clearTimeout(moveResultTimeoutRef.current);
      moveResultTimeoutRef.current = null
    }
  },[transactionCancelCount])

  const handleMoveTransaction = (rowIndex: number, colIndex: number) => {
    setLoadingCell({ row: rowIndex, col: colIndex });

    if (moveResultTimeoutRef.current) { clearTimeout(moveResultTimeoutRef.current) }

    moveResultTimeoutRef.current = window.setTimeout(() => {
      setLoadingCell(null);
      setErrorMessage("Transaction timed out. Please try again.")
    }, 60000)

    try {
      if (mode === "singleplayer") {
        executeWriteContract({ functionName: "move", args: [rowIndex, colIndex], mode });
        setTimeout(() => {
          executeWriteContract({ functionName: "aiMove", mode });
        }, 10000);
      } else {
        executeWriteContract({ functionName: "move", args: [rowIndex, colIndex], mode });
      }
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  useEffect(() => {
    if (loadingCell) {
      setLoadingCell(null);
    }
  }, [turnMessage])

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
      {!bothPlayersPlacedShips && mode !== "singleplayer" ? (
        <div>
          {shipPlacementPlayer === account.address && (
            <h2>Waiting for opponent to place their ships...</h2>
          )}
        </div>
      ) : (
        <div>
          <div
            className={`flex items-center justify-center ${turnMessage === "Your turn"
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-50"
              }`}
          >
            <div className="grid grid-cols-10 gap-0.5 bg-[#1212ab] p-0.5">
              {enemyGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <button
                      key={`${row}-${colIndex}`}
                      disabled={cell === 2 || cell === 3 || loadingCell !== null}
                      className={`flex items-center justify-center border border-black w-10 h-10 ${colorByState(cell)} ${cell !== 2 && cell !== 3 && "cursor-pointer hover:bg-slate-700"}`}
                      type="button"
                      onClick={() =>
                        handleMoveTransaction(rowIndex, colIndex)
                      }
                    >
                      {loadingCell &&
                        loadingCell.row === rowIndex &&
                        loadingCell.col === colIndex ? (
                        <Loader size="md" />
                      ) : (
                        cell === 2 || cell === 3 ? (
                          <span className="text-black font-bold text-3xl h-full">
                            x
                          </span>
                        ) : (
                          <span>Fire</span>
                        )
                      )}
                    </button>
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
