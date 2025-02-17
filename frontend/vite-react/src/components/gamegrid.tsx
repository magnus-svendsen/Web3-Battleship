import {
  useWriteContract,
  useWatchContractEvent,
  usePublicClient,
  useAccount,
} from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import Ship from "./ship";
import DroppableGridCell from "./DroppableGridCell";

import { Button } from '@mantine/core';
import { Coordinate } from "../types/coordinate";

const GameGrid = () => {
  const account = useAccount();
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

  const [shipsSubmitted, setShipsSubmitted] = useState(false);
  const [moveMessage, setMoveMessage] = useState("");
  const [turnMessage, setTurnMessage] = useState("");
  const [bothPlayersPlacedShips, setBothPlayersPlacedShips] = useState(false);
  const [shipPlacementPlayer ,setShipPlacementPlayer] = useState("");
  const [playerJoined, setPlayerJoined] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
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

  // (We no longer need playerData for joining the game)
  // const playerData = { grid: grid, hitsReceived: 0 };

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

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "PlayerJoined",
    onLogs(logs) {
      setPlayerJoined(logs["0"].args.player ?? "");
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "ShipPlacement",
    onLogs(logs) {
      setShipPlacementPlayer(logs["0"].args.player ?? "");
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "BothPlayersPlacedShips",
    onLogs(logs) {
      setBothPlayersPlacedShips(logs["0"].args.placed ?? false);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "MoveResult",
    onLogs(logs) {
      console.log(logs["0"].args ?? "");
      const data = logs["0"].args 
      if (typeof data.pos === 'number') {} else {throw new Error("data.pos is undefined")}
      const coordinate = intToCoordinate(data.pos)
      
      
      if (data.player === account.address) {
        // Your move was made, so update enemy grid.
        if (data.hit) {
          enemyGrid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("You shot and hit!");
        } else {
          enemyGrid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("You shot and missed!");
        }
        // After your move, it's your opponent's turn.
        setTurnMessage("Opponent's turn");
      } else {
        // Opponent's move; update your grid.
        if (data.hit) {
          grid[coordinate.x][coordinate.y] = 3;
          setMoveMessage("Opponent shot and hit!");
        } else {
          grid[coordinate.x][coordinate.y] = 2;
          setMoveMessage("Opponent shot and missed!");
        }
        // After opponent's move, it's your turn.
        setTurnMessage("Your turn");
      }
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const intToCoordinate = (value: number): Coordinate => {
    const x = Math.floor(value / 10);
    const y = value % 10;
    return {x, y}
  }

  useEffect(() => {
    // DEBUGGING
    //account.address && console.log("Address of this player: ", account.address);
    playerJoined && console.log("Player joined:", playerJoined);
    //gameStarted && console.log("Game started!");
    shipPlacementPlayer && console.log("Ship placement player:", shipPlacementPlayer);
    bothPlayersPlacedShips && console.log("Both players placed ships!");
  }, [account.address, playerJoined, gameStarted, shipPlacementPlayer]);

  // Used for fetching recent events (helps keep data on refresh)
  useEffect(() => {
    const fetchshipPlacementPlayer = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock - BigInt(500);
        const pastShipPlacementEvents = await publicClient.getContractEvents({
          address: contractAddress,
          abi: abi,
          eventName: "ShipPlacement",
          fromBlock: fromBlock,
          toBlock: "latest",
        });

        if (pastShipPlacementEvents.length > 0) {
          const latestEvent =
            pastShipPlacementEvents[pastShipPlacementEvents.length - 1];
          setShipPlacementPlayer(latestEvent.args.player ?? "");
        } else {
          console.log("OLD DATA: CONSIDER RESETTING GAME");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }

    const fetchRecentEvents = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock - BigInt(500);
        const pastPlayerJoinedEvents = await publicClient.getContractEvents({
          address: contractAddress,
          abi: abi,
          eventName: "PlayerJoined",
          fromBlock: fromBlock,
          toBlock: "latest",
        });

        if (pastPlayerJoinedEvents.length > 0) {
          const latestEvent =
            pastPlayerJoinedEvents[pastPlayerJoinedEvents.length - 1];
          setPlayerJoined(latestEvent.args.player ?? "");
        } else {
          console.log("OLD DATA: CONSIDER RESETTING GAME");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }  
    }

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

    //fetchshipPlacementPlayer();
    //fetchRecentEvents();
    //fetchLastLogs();
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

  function colorByState(state: number) {
    if (state === 0) return "#050505";
    if (state === 1) return "#bb1010";
    if (state === 2) return "#ffffff";
    if (state === 3) return "#bb1010";
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
          marginTop: "60px",
        }}
      >
        {!gameStarted && (
          <div>
            {account.address === playerJoined ? (
              <h2 className="font-bold text-2xl py-8">Waiting for opponent...</h2>
            ) : (
                <Button
                  variant="filled" color="green" size="xl" radius="xl"
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
                </Button>
            )} 
          </div> 
        )}
        
        <div className="flex mt-40">
          {gameStarted && (
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
                    size="md" radius="md"
                    onClick={() => {
                      setShipsSubmitted(true)
                      writeContract({
                        abi,
                        address: contractAddress,
                        functionName: "placeShips",
                        args: [shipPositions],
                      })
                    }}
                  >
                    Submit Ships
                  </Button>
                </div>
              )}
            </div>
          )}
    
          {!bothPlayersPlacedShips ? (
            <div>
              {shipPlacementPlayer === account.address && (
                <h2>Waiting for opponent to place their ships...</h2>  
              )}
            </div>
          ) : (
            <div>
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
                          className=" cursor-pointer"
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
                          {(cell === 2 || cell === 3) ? (
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
                          ) : ( <span>Fire</span>
                        )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <h2>{moveMessage}</h2>
          <h2>{turnMessage}</h2>
        </div>
      </div>
    </>
  );
}

export default GameGrid;
