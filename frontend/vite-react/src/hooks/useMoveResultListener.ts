import { useAccount } from "wagmi";
import { intToCoordinate } from "../utils/coordinateUtils";
import { useGameContext } from "../contexts/GameContext";
import useWatchContractEventListener from "./useWatchContractEventListener";
import useGameWriteContract from "./useGameWriteContract";
import type { MoveResultEvent } from "../types/eventTypes";
import type { GameMode } from "../types/gameTypes";

export const useMoveResultListener = (mode: GameMode) => {
  const account = useAccount();

  const {
    grid,
    setGrid,
    enemyGrid,
    setEnemyGrid,
    setMoveMessage,
    setTurnMessage,
    moveResultTimeoutRef,
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
  } = useGameContext();

  const executeWriteContract = useGameWriteContract();

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
  
        // Clear loading cell and timer
        if (moveResultTimeoutRef.current != null) {
          clearTimeout(moveResultTimeoutRef.current)
          moveResultTimeoutRef.current = null;
        }
  
        if (mode === "singleplayer" ? data.isPlayerMove : data.player === account.address) {
          // Our move: update enemy grid.
          if (data.hit) {
            enemyGrid[coordinate.x][coordinate.y] = 3;
            setTimesHit(timesHit+1)
            updatedMoveMessage = data.gameOver ? "You won the game!" : "You shot and hit!";
          } else {
            enemyGrid[coordinate.x][coordinate.y] = 2;
            setTimesMiss(timesMiss+1)
            updatedMoveMessage = "You shot and missed!";
          }
          // If the game is over, no next turn.
          updatedTurnMessage = data.gameOver ? "" : "Opponent's turn";
          setEnemyGrid(enemyGrid);
          localStorage.setItem("enemyGrid", JSON.stringify(enemyGrid));
        } else {
          // Opponent's move: update our grid.
          if (data.hit) {
            grid[coordinate.x][coordinate.y] = 3;
            setEnemyTimesHit(enemyTimesHit+1)
            updatedMoveMessage = data.gameOver ? "You lost the game!" : "Opponent shot and hit!";
          } else {
            grid[coordinate.x][coordinate.y] = 2;
            setEnemyTimesMiss(enemyTimesMiss+1)
            updatedMoveMessage = "Opponent shot and missed!";
          }
          updatedTurnMessage = data.gameOver ? "" : "Your turn";
          setGrid(grid);
          localStorage.setItem("grid", JSON.stringify(grid));
        }
  
        if (moveResultTimeoutRef.current) { clearTimeout(moveResultTimeoutRef.current) }
        setMoveMessage(updatedMoveMessage);
        setTurnMessage(updatedTurnMessage);
        setTurnNumber(turnNumber+1)
        localStorage.setItem("moveMessage", JSON.stringify(updatedMoveMessage));
        localStorage.setItem("turnMessage", JSON.stringify(updatedTurnMessage));
  
        // If the game is over, reset the game after 5 seconds
        if (data.gameOver) {
          setTimeout(() => {
            executeWriteContract({ functionName: "resetGame", mode });
          }, 5000);
        }
      },
      mode,
    });

}