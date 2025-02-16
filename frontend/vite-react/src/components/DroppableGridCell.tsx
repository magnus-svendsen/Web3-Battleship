import { useDroppable } from "@dnd-kit/core";
import type { GridCellData } from "../types/gridCellTypes"


const DroppableGridCell: React.FC<GridCellData> = ({row, col, state}) => {

    const { setNodeRef } = useDroppable({
        id: `cell-${row}-${col}`,
        data: { row, col },
    });

    const colorByState = (color:number) => {

        if (color === 0 || color === 2) {return "#ffffff"}
        if (color === 1) {return "#050505"}
        if (color === 3) {return "#bb1010"}
        return "#000000"
    }


    return (
        <div
          ref={setNodeRef}
          key={`${row}-${col}`} // Unique key for each cell
          style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid black',
              cursor: 'pointer',
              backgroundColor: colorByState(state)
          }}
          //onClick={() => onClick()}
          >
            {(state === 2 || state === 3) && (
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
            )}
        </div>
    )
}
export default DroppableGridCell