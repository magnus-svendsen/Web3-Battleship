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

const ShipPlacement = () => {
  const account = useAccount();

  const {
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
    setTurnMessage,
    setErrorMessage,
    transactionCancelCount,
  } = useGameContext();

  const executeWriteContract = useGameWriteContract();
  const { handleDragEnd } = useShipDragEnd();
  const { handleDragOver } = useShipDragOver();

  const timeoutRef = useRef<number | null>(null);

  const [shipsSubmitted, setShipsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitShips = () => {
    setIsLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
      setErrorMessage("Failed to submit ships. Please try again");
    }, 60000); // 60sec timeout if no transaction is validated
    executeWriteContract({ functionName: "placeShips", args: [shipPositions] });
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
    },
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

  useEffect(() => {
    const storedShipPlacementPlayer = localStorage.getItem(
      "shipPlacementPlayer"
    );
    if (storedShipPlacementPlayer) {
      setShipPlacementPlayer(JSON.parse(storedShipPlacementPlayer));
    }
    const storedShipsSubmitted = localStorage.getItem("shipsSubmitted");
    if (storedShipsSubmitted) {
      setShipsSubmitted(JSON.parse(storedShipsSubmitted));
    }
    const storedPlacedShips = localStorage.getItem("placedShips");
    if (storedPlacedShips) {
      setPlacedShips(JSON.parse(storedPlacedShips));
    }
    const storedBothPlayersPlacedShips = localStorage.getItem(
      "bothPlayersPlacedShips"
    );
    if (storedBothPlayersPlacedShips) {
      setBothPlayersPlacedShips(JSON.parse(storedBothPlayersPlacedShips));
    }
    const savedTurnMessage = localStorage.getItem("turnMessage");
    if (savedTurnMessage) {
      setTurnMessage(JSON.parse(savedTurnMessage));
    }
  }, []);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
          <div className="flex flex-col p-5 mb-21">
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
              <Button color="orange" onClick={regretShipPlacement}>Reset ships</Button>
            )}
          </div>
        </div>
      </DndContext>

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
              disabled={true}
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
    </div>
  );
};

export default ShipPlacement;
