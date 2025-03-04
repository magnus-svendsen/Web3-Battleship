import { useDroppable } from "@dnd-kit/core";
import type { GridCellData } from "../types/gridCellTypes";

const DroppableGridCell: React.FC<GridCellData> = ({ row, col, state, isPreview }) => {
  const { setNodeRef } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  const colorByState = (cellState: number) => {
    // 0: empty, 1: ship, 2: miss, 3: hit / placing ship

    if (cellState === 0 || cellState === 2) {
      return "#ffffff";
    }
    if (cellState === 1) {
      return "#050505";
    }
    if (cellState === 3) {
      // If we're in preview mode, use a different color (e.g. light blue).
      return isPreview ? "#00ccff" : "#bb1010";
    }
    return "#000000";
  };

  return (
    <div
      ref={setNodeRef}
      key={`${row}-${col}`} // Unique key for each cell
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        backgroundColor: colorByState(state),
      }}
    >
      {(state === 2 || (state === 3 && !isPreview)) && (
        <span className="text-black font-bold text-3xl h-full">
          x
        </span>
      )}
    </div>
  );
};
export default DroppableGridCell;
