import { useCallback } from "react";
import type { DragOverEvent } from "@dnd-kit/core";
import { getIntendedCoordinates } from "../utils/shipDragHelpers";
import { getShipLengthById } from "../utils/shipLengths";
import { useGameContext } from "../contexts/GameContext";
import type { GridData } from "../types/gridTypes";

export const useShipDragOver = () => {
  const { grid, setTempGrid, shipOrientations } = useGameContext();

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const activeId = event.active.id.toString();
    const overId = event.over?.id?.toString();
    const intendedCoordinates = getIntendedCoordinates(
      activeId,
      overId,
      getShipLengthById,
      shipOrientations
    );
    // If no valid coordinates, reset preview.
    if (intendedCoordinates.length === 0) {
      setTempGrid(grid);
      return;
    }
    // Check for conflicts: if any cell is already occupied.
    const conflict = intendedCoordinates.some(([r, c]) => grid[r][c] !== 0);
    if (conflict) {
      setTempGrid(grid);
      return;
    }
    // Otherwise, build a temporary grid with preview values (e.g. 3) for intended cells.
    const updatedTempGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        const isInPreview = intendedCoordinates.some(
          ([r, c]) => r === rowIndex && c === colIndex
        );
        return isInPreview ? 3 : cell;
      })
    ) as GridData;
    setTempGrid(updatedTempGrid);
  }, [grid, shipOrientations, setTempGrid]);

  return { handleDragOver };
};
