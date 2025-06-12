import { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { getIntendedCoordinates } from "../utils/shipDragHelpers";
import { getShipLengthById } from "../utils/shipLengths";
import { useGameContext } from "../contexts/GameContext";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";

export const useShipDragEnd = () => {
  const {
    grid,
    setGrid,
    placedShips,
    setPlacedShips,
    shipOrientations,
    setTempGrid,
    setIsDragging,
    setShipPositions,
  } = useGameContext();

  const [, setShipData] = useState<ShipDataContract[]>([]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // Convert active.id to string and use it as the ship identifier.
    const activeId = event.active.id.toString();
    const overId = event.over?.id?.toString();
    // Get intended coordinates using our helper function.
    const intendedCoordinates = getIntendedCoordinates(
      activeId,
      overId,
      getShipLengthById,
      shipOrientations
    );
    // If out of range or no coordinates computed, exit.
    if (intendedCoordinates.length === 0) return;
    
    // Check if any intended cell is already occupied.
    const conflict = intendedCoordinates.some(([r, c]) => grid[r][c] !== 0);
    if (conflict) return;

    // Determine ship index from active id.
    const shipID = Number(activeId) - 1;
    const updatedPlacedShips = [...placedShips];
    const updatedGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (intendedCoordinates.some(([r, c]) => r === rowIndex && c === colIndex)) {
          updatedPlacedShips[shipID] = true;
          return 1; // Mark the cell as occupied by a ship.
        }
        return cell;
      })
    ) as GridData;

    // Build ship data object for UI purposes.
    const ship: ShipDataContract = {
      length: getShipLengthById(Number(activeId)),
      timesHit: 0,
      isDestroyed: false,
      coordinates: intendedCoordinates,
    };
    setShipData((prevShips) => [...prevShips, ship]);

    // Update grid, placedShips and tempGrid states.
    setGrid(updatedGrid);
    setPlacedShips(updatedPlacedShips);
    setTempGrid(updatedGrid);
    setIsDragging(false);

    // Convert intended coordinates to encoded positions and update shipPositions.
    const encodedPositions = intendedCoordinates.map(([r, c]) => r * 10 + c);
    setShipPositions((prevPositions) => [...prevPositions, ...encodedPositions]);
  }, [
    grid,
    placedShips,
    shipOrientations,
    setGrid,
    setPlacedShips,
    setTempGrid,
    setIsDragging,
    setShipPositions,
  ]);

  return { handleDragEnd };
};
