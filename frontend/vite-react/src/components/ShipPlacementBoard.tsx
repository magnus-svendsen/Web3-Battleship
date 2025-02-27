import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Ship from "./ship";
import DroppableGridCell from "./DroppableGridCell";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { contractAddress } from "../utils/contractAddress";
import { useAccount, useWriteContract } from "wagmi";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import { abi } from "../utils/abi";
import { useGameContext } from "../contexts/GameContext";
import usePastEventValue from "../hooks/usePastEventValue";
import useWatchContractEventListener from "../hooks/useWatchContractEventListener";
import type { BothPlayersPlacedShipsEvent, ShipPlacementEvent } from "../types/eventTypes";

const ShipPlacementBoard = () => {
  const account = useAccount();

  const { playerJoined, grid, setGrid, shipPlacementPlayer, setShipPlacementPlayer, bothPlayersPlacedShips, setBothPlayersPlacedShips, setMoveMessage, setTurnMessage } = useGameContext();

  const { writeContract } = useWriteContract();

  const [shipsSubmitted, setShipsSubmitted] = useState(false);
  const [placeShip, setPlaceShips] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [shipOrientations, setShipsOrientations] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [placedShips, setPlacedShips] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [shipData, setShipData] = useState<ShipDataContract[]>([]);
  // New state for storing encoded ship positions (each as row * 10 + col)
  const [shipPositions, setShipPositions] = useState<number[]>([]);

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

  useEffect(() => {
    setShipPlacementPlayer(shipPlacementValue);
  }, [shipPlacementValue]);

  useEffect(() => {
    setBothPlayersPlacedShips(bothPlayersPlacedShipsValue);
    console.log("Both players placed ships:", bothPlayersPlacedShipsValue);
    if (bothPlayersPlacedShipsValue || bothPlayersPlacedShips) {
      setShipsSubmitted(true)
      setPlacedShips([true, true, true, true, true])
      setShipPositions(shipPositions);
      
      const savedGrid = localStorage.getItem("shipGrid");
      if (savedGrid) {
        setGrid(JSON.parse(savedGrid));
      }
    }
  }, [bothPlayersPlacedShips, bothPlayersPlacedShipsValue]); 

  const handleOrientationChange = (id: number) => {
    const oldShipOrientation = shipOrientations;
    oldShipOrientation[id] = !oldShipOrientation[id];
    setShipsOrientations([...oldShipOrientation]);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const shipID = Number(event.active.id) - 1;
    const lengthOfShip = lengthByID(Number(event.active.id));
    const tempHover = String(event.over?.id).split("-") || [0, 0, 0];
    const row = Number(tempHover[1]);
    const col = Number(tempHover[2]);
    
    // Determine intended coordinates based on orientation:
    const intendedCoordinates: [number, number][] = [];
    if (!shipOrientations[shipID]) {
      // Horizontal placement
      if (col + lengthOfShip > 10) {
        // Out of range
        return;
      }
      for (let c = col; c < col + lengthOfShip; c++) {
        intendedCoordinates.push([row, c]);
      }
    } else {
      // Vertical placement
      if (row + lengthOfShip > 10) {
        // Out of range
        return;
      }
      for (let r = row; r < row + lengthOfShip; r++) {
        intendedCoordinates.push([r, col]);
      }
    }
  
    // Check if any of the intended coordinates already have a ship (non-zero value)
    const conflict = intendedCoordinates.some(
      ([r, c]) => grid[r][c] !== 0
    );
    if (conflict) {
      return;
    }
  
    // If no conflict, update placedShips and grid:
    const updatedPlacedShips = [...placedShips];
    const updatedGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        // Check if the cell is within the intended coordinates:
        if (intendedCoordinates.some(([r, c]) => r === rowIndex && c === colIndex)) {
          updatedPlacedShips[shipID] = true;
          return 1;
        }
        return cell;
      })
    );
  
    // Build a ship data object for UI purposes (if needed)
    const ship: ShipDataContract = {
      length: lengthOfShip,
      timesHit: 0,
      isDestroyed: false,
      coordinates: intendedCoordinates,
    };
    setShipData((prevShips) => [...prevShips, ship]);
  
    // Update grid, placedShips states, and tempGrid
    setGrid(updatedGrid);
    setPlacedShips(updatedPlacedShips);
    setTempGrid(updatedGrid);
    setIsDragging(false);
  
    // Convert the coordinate pairs to encoded values and update shipPositions.
    const encodedPositions = intendedCoordinates.map(([r, c]) => r * 10 + c);
    setShipPositions((prevPositions) => [...prevPositions, ...encodedPositions]);
  };
  

  const handleDragOver = (event: DragOverEvent) => {
    const shipID = Number(event.active.id) - 1;
    const lengthOfShip = lengthByID(Number(event.active.id));
    const tempHover = String(event.over?.id).split("-") || [0, 0, 0];
    const row = Number(tempHover[1]);
    const col = Number(tempHover[2]);
  
    // Compute intended coordinates based on orientation.
    const intendedCoordinates: [number, number][] = [];
    if (!shipOrientations[shipID]) {
      // Horizontal placement
      if (col + lengthOfShip <= 10) {
        for (let c = col; c < col + lengthOfShip; c++) {
          intendedCoordinates.push([row, c]);
        }
      }
    } else {
      // Vertical placement
      if (row + lengthOfShip <= 10) {
        for (let r = row; r < row + lengthOfShip; r++) {
          intendedCoordinates.push([r, col]);
        }
      }
    }
  
    // Check if any of the intended coordinates already have a ship.
    const conflict = intendedCoordinates.some(
      ([r, c]) => grid[r][c] !== 0
    );
  
    // If conflict exists, do not show any preview.
    if (conflict) {
      setTempGrid(grid);
      return;
    }
  
    // Otherwise, update the temp grid to show the preview (value 3) for intended cells.
    const updatedTempGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        const isInPreview = intendedCoordinates.some(
          ([r, c]) => r === rowIndex && c === colIndex
        );
        return isInPreview ? 3 : cell;
      })
    );
    setTempGrid(updatedTempGrid);
  };

  const lengthByID = (id: number) => {
    if (id === 1) return 5;
    if (id === 2) return 4;
    if (id === 3) return 3;
    if (id === 4) return 3;
    if (id === 5) return 2;
    return 0;
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
                />
              ))
            )}
          </div>
          <div>
            {placeShip && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                }}
              >
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
            )}
          </div>
        </div>
      </DndContext>
      {placedShips.every(Boolean) && !shipsSubmitted && (
        <div className="flex justify-center mt-2">
          <Button
            size="md"
            radius="md"
            onClick={() => {
              writeContract({
                abi,
                address: contractAddress,
                functionName: "placeShips",
                args: [shipPositions],
              });
            }}
          >
            Submit Ships
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShipPlacementBoard;