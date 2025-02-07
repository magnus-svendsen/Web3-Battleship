
import { useEffect, useState } from "react";
import type { ShipData, ShipDataOrientation } from "../types/shipTypes.ts";
import { useDraggable } from "@dnd-kit/core";

interface ShipProps extends ShipData {
    onOrientationChange: (id:number, isHorizontal: boolean) => void,
}

const Ship: React.FC<ShipProps> = ({id, length, onOrientationChange}) => {
    const [isHorizontal, setIsHorizontal] = useState(true)

    const toggleIsHorizontal = () => {
        setIsHorizontal(!isHorizontal);
    }

    const handleOnKeyDown = (e: { key: string; }) => {
        if (e.key == "r" && isDragging) {
            toggleIsHorizontal()
        }
    }

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: id+1,       // ID 0 causes issues
        data: {id, length, isHorizontal} as ShipDataOrientation
      });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;

    useEffect(() => {
        onOrientationChange(id,isHorizontal)
    },[isHorizontal])

    return(
        <div>
            <button 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            onDoubleClick={toggleIsHorizontal}
            onKeyDown={handleOnKeyDown}
            >
                <div style={{
                    display: "flex",
                    flexDirection: isHorizontal ? "row" : "column",
                    cursor: "move",
                }}>
                    {[...Array(length)].map((_id, index) => (
                        <div
                        key={index}
                        style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "1px",
                            marginLeft: "1px",
                            backgroundColor: "#ababab",
                            border: "1px solid black"
                        }}/>                        
                    ))}
                </div>
            </button>
        </div>
    )
}

export default Ship;