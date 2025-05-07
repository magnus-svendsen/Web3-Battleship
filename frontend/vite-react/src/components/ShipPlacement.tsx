import { DndContext } from "@dnd-kit/core";
import Ship from "./ship";
import DroppableGridCell from "./DroppableGridCell";
import { useEffect, useRef, useState } from "react";
import { Button, Loader } from "@mantine/core";
import { useAccount } from "wagmi";
import { useGameContext } from "../contexts/GameContext";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type {
  BothPlayersPlacedShipsEvent,
  ShipPlacementEvent,
} from "../types/eventTypes";
import useGameWriteContract from "../hooks/useGameWriteContract";
import { useShipDragEnd } from "../hooks/useShipDragEnd";
import { useShipDragOver } from "../hooks/useShipDragOver";
import PlacementHelpIcon from "./PlacementHelpIcon";
import PlayerCard from "./PlayerCard";

const ShipPlacement = () => {
  const account = useAccount();

  const {
    mode,
    grid,
    setGrid,
    tempGrid,
    setTempGrid,
    placedShips,
    setPlacedShips,
    shipPositions,
    setShipPositions,
    isDragging,
    setIsDragging,
    shipOrientations,
    setShipsOrientations,
    firstPlayerJoined,
    setShipPlacementPlayer,
    setBothPlayersPlacedShips,
    bothPlayersPlacedShips,
    setTurnMessage,
    setErrorMessage,
    transactionCancelCount,
    playerInfoProps
  } = useGameContext();

  const executeWriteContract = useGameWriteContract();
  const { handleDragEnd } = useShipDragEnd();
  const { handleDragOver } = useShipDragOver();

  const timeoutRef = useRef<number | null>(null);

  const [shipsSubmitted, setShipsSubmitted] = useState<boolean>(
    localStorage.getItem("shipsSubmitted") === "true"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitShips = () => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to submit ships. Please try again");
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({
      functionName: "placeShips",
      args: [shipPositions],
      mode,
    });
  };

  useEffect(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [transactionCancelCount]);

  useWatchContractEventListener({
    eventName: "ShipPlacement",
    onEvent: (logs: ShipPlacementEvent[]) => {
      const shipPlayer = logs[0].args.player ?? "";
      setShipPlacementPlayer(shipPlayer);
      localStorage.setItem("shipPlacementPlayer", JSON.stringify(shipPlayer));
      // If player is equal to the current account, reset timer
      if (logs[0].args.player === account.address) {
        setIsLoading(false);
        if (timeoutRef.current != null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }

      // Only update local storage for the correct account.
      if (shipPlayer === account.address) {
        localStorage.setItem("grid", JSON.stringify(grid));
        setShipsSubmitted(true);
        localStorage.setItem("shipsSubmitted", JSON.stringify(true));
        localStorage.setItem(
          "placedShips",
          JSON.stringify([true, true, true, true, true])
        );
        localStorage.setItem("shipPositions", JSON.stringify(shipPositions));
      }

      if (mode === "singleplayer") {
        const message = "Your turn";
        setTurnMessage(message);
        localStorage.setItem("turnMessage", JSON.stringify(message));
      }
    },
    mode,
  });

  useWatchContractEventListener({
    eventName: "BothPlayersPlacedShips",
    onEvent: (logs: BothPlayersPlacedShipsEvent[]) => {
      const placed = logs[0].args.placed ?? false;
      setBothPlayersPlacedShips(placed);
      localStorage.setItem("bothPlayersPlacedShips", JSON.stringify(placed));
      if (firstPlayerJoined === account.address) {
        const message = "Your turn";
        setTurnMessage(message);
        localStorage.setItem("turnMessage", JSON.stringify(message));
      } else {
        const message = "Opponent's turn";
        setTurnMessage(message);
        localStorage.setItem("turnMessage", JSON.stringify(message));
      }
    },
  });

  const handleOrientationChange = (id: number) => {
    const oldShipOrientation = shipOrientations;
    oldShipOrientation[id] = !oldShipOrientation[id];
    setShipsOrientations([...oldShipOrientation]);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const regretShipPlacement = () => {
    //Reset data
    setPlacedShips([false, false, false, false, false]);
    setShipPositions([]);
    setShipsOrientations([false, false, false, false, false]);
    setGrid([
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
    setTempGrid([
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
  };

  const lengthByIDShipRendering = (id: number) => {
    if (id === 0) return 5;
    if (id === 1) return 4;
    if (id === 2) return 3;
    if (id === 3) return 3;
    if (id === 4) return 2;
    return 0;
  };

  return (
    <div>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
      >
        <PlayerCard {...playerInfoProps} />

        <div className="flex justify-center">
          <div className="relative">

            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(10, 40px)",
                gap: "2px",
                backgroundColor: "#1212ab",
                padding: "2px",
              }}
            >
              {(isDragging ? tempGrid : grid).map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <DroppableGridCell
                    key={`${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    state={cell}
                    isPreview={isDragging}
                  />
                ))
              )}
            </div>

            <div className={"absolute top-0 left-full ml-4 flex flex-col p-5"
             + (bothPlayersPlacedShips ? "-z-10" : "z-0")}>
              <div className="mb-10">
                {!placedShips.every(Boolean) && (
                  <div className="flex justify-center">
                    <PlacementHelpIcon />
                  </div>
                )}
              </div>
              <div>
                {[0, 1, 2, 3, 4].map((id) =>
                  !placedShips[id] ? (
                    <Ship
                      key={id}
                      id={id}
                      length={lengthByIDShipRendering(id)}
                      onOrientationChange={handleOrientationChange}
                    />
                  ) : null
                )}
              </div>
              {placedShips.some((isPlaced) => isPlaced) && !shipsSubmitted && (
                <Button color="orange" onClick={regretShipPlacement}>
                  Reset ships
                </Button>
              )}
            </div>
          </div>
        </div>

        {placedShips.every(Boolean) && !shipsSubmitted && (
          <div className="flex justify-center mt-5">
            {isLoading ? (
              <Button
                variant="red"
                color="teal"
                size="lg"
                radius="lg"
                className="mr-2"
                type="button"
                disabled
              >
                <Loader />
              </Button>
            ) : (
              <Button size="lg" radius="lg" onClick={handleSubmitShips}>
                Submit Ships
              </Button>
            )}
          </div>
        )}
      </DndContext>
    </div>
  );
};

export default ShipPlacement;
