import {
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWatchContractEvent,
  usePublicClient,
} from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import Ship from "./ship";
import DroppableGridCell from "./cell";

function GameGrid() {
  const { writeContract } = useWriteContract();
  const publicClient = usePublicClient();

  const [grid, setGrid] = useState<GridData>([
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

  const [enemyGrid, setEnemyGrid] = useState<GridData>([
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

  const [gameStarted, setGameStarted] = useState(false);
  const [placeShip, setPlaceShips] = useState(false);
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

  // (We no longer need playerData for joining the game)
  // const playerData = { grid: grid, hitsReceived: 0 };

  const { sendTransaction } = useSendTransaction();

  const player1 = useReadContract({
    abi,
    address: contractAddress,
    functionName: "player1",
  });

  const player2 = useReadContract({
    abi,
    address: contractAddress,
    functionName: "player2",
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "GameStarted",
    onLogs(logs) {
      setGameStarted(logs["0"].args.started ?? false);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  useEffect(() => {
    // DEBUGGING
    gameStarted && console.log("Game started!");
  }, [gameStarted]);

  // Used for fetching recent events (helps keep data on refresh)
  useEffect(() => {
    const fetchLastLogs = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock - BigInt(500);

        const pastGameStartedEvents = await publicClient.getContractEvents({
          address: contractAddress,
          abi: abi,
          eventName: "GameStarted",
          fromBlock: fromBlock,
          toBlock: "latest",
        });

        if (pastGameStartedEvents.length > 0) {
          const latestEvent =
            pastGameStartedEvents[pastGameStartedEvents.length - 1];
          setGameStarted(latestEvent.args.started ?? false);
        } else {
          console.log("OLD DATA: CONSIDER RESETTING GAME");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLastLogs();
  }, [publicClient]);

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

    let coordinates: [number, number][] = [];
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
            } else {
              return grid[rowIndex][colIndex];
            }
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
            } else {
              return grid[rowIndex][colIndex];
            }
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

  const placeShipsButton = () => {
    setPlaceShips(!placeShip);
  };

  function colorByState(state: number) {
    if (state === 0) return "#3d3d3d";
    if (state === 1) return "#bb1010";
  }

  return (
    <>
      {gameStarted && (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          Game has started!
        </h1>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          type="button"
          onClick={() =>
            sendTransaction({
              to: "0x71b604B6C2F41Fa91Dd0e3e41221C9c6c6c75313",
              value: parseEther("0.1"),
            })
          }
        >
          Send Transaction
        </button>

        {/* Updated Join button: now calls join() without passing extra data */}
        <button
          type="button"
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "join",
              args: [],
            })
          }
        >
          Join a game!
        </button>

        <button
          type="button"
          style={{
            backgroundColor: "#04AA6D",
            border: "none",
            color: "white",
            padding: "6px 22px",
            borderRadius: "12px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
          }}
          onClick={placeShipsButton}
        >
          <h3>Place ships</h3>
        </button>

        {/* New Submit Ships button: sends the encoded ship positions to the contract */}
        {shipPositions.length > 0 && (
          <button
            type="button"
            style={{
              backgroundColor: "#007BFF",
              border: "none",
              color: "white",
              padding: "6px 22px",
              borderRadius: "12px",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",
              fontSize: "16px",
            }}
            onClick={() =>
              writeContract({
                abi,
                address: contractAddress,
                functionName: "placeShips",
                args: [shipPositions],
              })
            }
          >
            Submit Ships
          </button>
        )}

        <div>
          <p>Player1: {player1.data}</p>
          <p>Player2: {player2.data}</p>
          {player1.data && player2.data && (
            <p>Both players have joined, let the game begin!</p>
          )}
        </div>

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

        <h2>ENEMY TERRITORY</h2>
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
            {enemyGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${row}-${colIndex}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid black",
                    cursor: "pointer",
                    backgroundColor: colorByState(cell),
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      writeContract({
                        abi,
                        address: contractAddress,
                        functionName: "move",
                        args: [rowIndex, colIndex],
                      })
                    }
                  >
                    Fire
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GameGrid;
