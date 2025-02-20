import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Ship from "./Ship";
import DroppableGridCell from "./DroppableGridCell";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { contractAddress } from "../utils/contractAddress";
import { useWriteContract } from "wagmi";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import { abi } from "../utils/abi";
import { useGameContext } from "../contexts/GameContext";

const ShipPlacementBoard = () => {
  const { grid, setGrid } = useGameContext();

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

  const handleOrientationChange = (id: number, isHorizontal: boolean) => {
    const oldShipOrientation = shipOrientations;
    oldShipOrientation[id] = !oldShipOrientation[id];
    setShipsOrientations([...oldShipOrientation]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const shipID = Number(event.active.id) - 1;
    const lengthOfShip = lengthByID(Number(event.active.id));
    const tempHover = String(event.over?.id).split("-") || [0, 0, 0];
    const row = Number(tempHover[1]);
    const col = Number(tempHover[2]);
    const updatedPlacedShips = [...placedShips];

    const coordinates: [number, number][] = [];
    const updatedGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (!shipOrientations[shipID]) {
          // Horizontal ship placement
          if (
            rowIndex === row &&
            colIndex >= col &&
            colIndex < col + lengthOfShip
          ) {
            if (col + lengthOfShip <= 10) {
              updatedPlacedShips[shipID] = true;
              coordinates.push([rowIndex, colIndex]);
              return 1;
            }
              return grid[rowIndex][colIndex];
          }
        } else {
          // Vertical ship placement
          if (
            colIndex === col &&
            rowIndex >= row &&
            rowIndex < row + lengthOfShip
          ) {
            if (row + lengthOfShip <= 10) {
              updatedPlacedShips[shipID] = true;
              coordinates.push([rowIndex, colIndex]);
              return 1;
            }
              return grid[rowIndex][colIndex];
          }
        }
        return grid[rowIndex][colIndex];
      })
    );

    // Build a ship data object for UI purposes (if needed)
    const ship: ShipDataContract = {
      length: lengthOfShip,
      timesHit: 0,
      isDestroyed: false,
      coordinates: coordinates,
    };
    setShipData((prevShips) => [...prevShips, ship]);

    // Update grid and placedShips states
    setGrid(updatedGrid);
    setPlacedShips(updatedPlacedShips);
    setTempGrid(updatedGrid);
    setIsDragging(false);

    // NEW: Convert the coordinate pairs to encoded values and update shipPositions.
    const encodedPositions = coordinates.map(
      ([r, c]) => r * 10 + c
    );
    setShipPositions((prevPositions) => [...prevPositions, ...encodedPositions]);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const shipID = Number(event.active.id) - 1;
    const lengthOfShip = lengthByID(Number(event.active.id));
    const tempHover = String(event.over?.id).split("-") || [0, 0, 0];
    const row = Number(tempHover[1]);
    const col = Number(tempHover[2]);

    const updatedTempGrid = tempGrid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (!shipOrientations[shipID]) {
          // Horizontal ship placement preview
          if (
            rowIndex === row &&
            colIndex >= col &&
            colIndex < col + lengthOfShip
          ) {
            return col + lengthOfShip <= 10 ? 3 : grid[rowIndex][colIndex];
          }
        } else {
          // Vertical ship placement preview
          if (
            colIndex === col &&
            rowIndex >= row &&
            rowIndex < row + lengthOfShip
          ) {
            return row + lengthOfShip <= 10 ? 3 : grid[rowIndex][colIndex];
          }
        }
        return grid[rowIndex][colIndex];
      })
    );
    setTempGrid(updatedTempGrid);
  };

  // On component mount, load saved grid state:
useEffect(() => {
  const savedGrid = localStorage.getItem("shipGrid");
  if (savedGrid) {
    setGrid(JSON.parse(savedGrid));
  }
  const savedTempGrid = localStorage.getItem("shipTempGrid");
  if (savedTempGrid) {
    setTempGrid(JSON.parse(savedTempGrid));
  }
  const savedShipPositions = localStorage.getItem("shipPositions");
  if (savedShipPositions) {
    setShipPositions(JSON.parse(savedShipPositions));
  }
}, []);

// Whenever grid state updates, persist it:
useEffect(() => {
  localStorage.setItem("shipGrid", JSON.stringify(grid));
}, [grid]);

useEffect(() => {
  localStorage.setItem("shipTempGrid", JSON.stringify(tempGrid));
}, [tempGrid]);

useEffect(() => {
  console.log("Ship positions: ", shipPositions);
  localStorage.setItem("shipPositions", JSON.stringify(shipPositions));
}, [shipPositions]);


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
              setShipsSubmitted(true);
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