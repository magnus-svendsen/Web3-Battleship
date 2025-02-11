import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWatchContractEvent,
  usePublicClient,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
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
import { config } from "../wagmi"
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import Ship from "./ship";
import DroppableGridCell from "./cell";



function GameGrid() {
  const { writeContract } = useWriteContract();
  const publicClient = usePublicClient()

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
  const [playGame, setPlayGame] = useState(false);
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

  const playerData = {
    shipsRemaining: 5, // or the number of ships you intend to deploy
    grid: grid, // your 10x10 grid state
  };

  const shipsArray: any[] = []; // adjust type as needed (e.g., ShipDataContract[]

  const { sendTransaction } = useSendTransaction();

  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
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
      console.log('Error', error)
    }
  });

  useEffect(() => {
    // DEBUGGING
    gameStarted && console.log("Game started!");
  }, [gameStarted]);

  // Used for getting the last events emitted. Usefull for keeping redudant data on refresh.
  // Add additional events in here
  useEffect(() => {
    const fetchLastLogs = async () => {
      try {
        const latestBlock = await publicClient.getBlockNumber() // Get current block
        const fromBlock = latestBlock - BigInt(500) // Fetch last 500 blocks. Equivalent to about last 2 hours


        const pastGameStartedEvents = await publicClient.getContractEvents({
          address: contractAddress, // Example: DAI contract
          abi: abi,
          eventName: "GameStarted",
          fromBlock: fromBlock,
          toBlock: 'latest', // Fetch up to the latest block
        })

        

        if(pastGameStartedEvents.length > 0) {
          const latestEvent = pastGameStartedEvents[pastGameStartedEvents.length-1]
          setGameStarted(latestEvent.args.started ?? false)
        } else {
          console.log("OLD DATA: CONSIDER RESETTING GAME")
        }
      } catch (error) {
        console.error('Error fetching logs:', error)
      }
    }

    fetchLastLogs()
  }, [publicClient])


  const handleOrientationChange = (id: number, isHorizontal: boolean) => {
    const oldShipOrientation = shipOrientations;
    oldShipOrientation[id] = !oldShipOrientation[id];
    setShipsOrientations(oldShipOrientation);
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
    const updatedPlacedShips = placedShips;

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
          if (
            colIndex === col &&
            rowIndex >= row &&
            rowIndex < row + lengthOfShip
          ) {
            if (row + lengthOfShip <= 10) {
              updatedPlacedShips[shipID] = true;
              return 1;
            } else {
              grid[rowIndex][colIndex];
            }
          }
        }
        // Default state for cells outside hover area
        return grid[rowIndex][colIndex];
      })
    );
    const ship: ShipDataContract = {
      length: lengthOfShip,
      timesHit: 0,
      isDestroyed: false,
      coordinates: coordinates,
    };
    const shipsContract: ShipDataContract[] = shipData;
    shipsContract.push(ship);
    setShipData(shipsContract);

    setGrid(updatedGrid);
    setPlacedShips(updatedPlacedShips);
    setTempGrid(grid);
    setIsDragging(false);
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
          // Horizontal ship placement
          if (
            rowIndex === row &&
            colIndex >= col &&
            colIndex < col + lengthOfShip
          ) {
            // Ensure ship does not overflow grid width
            return col + lengthOfShip <= 10 ? 3 : grid[rowIndex][colIndex];
          }
        } else {
          // Vertical ship placement
          if (
            colIndex === col &&
            rowIndex >= row &&
            rowIndex < row + lengthOfShip
          ) {
            // Ensure ship does not overflow grid height
            return row + lengthOfShip <= 10 ? 3 : grid[rowIndex][colIndex];
          }
        }
        // Default state for cells outside hover area
        return grid[rowIndex][colIndex];
      })
    );
    setTempGrid(updatedTempGrid);
  };

  const lengthByID = (id: number) => {
    if (id === 1) {
      return 5;
    }
    if (id === 2) {
      return 4;
    }
    if (id === 3) {
      return 3;
    }
    if (id === 4) {
      return 3;
    }
    if (id === 5) {
      return 2;
    } else return 0;
  };

  const lengthByIDShipRendering = (id: number) => {
    if (id === 0) {
      return 5;
    }
    if (id === 1) {
      return 4;
    }
    if (id === 2) {
      return 3;
    }
    if (id === 3) {
      return 3;
    }
    if (id === 4) {
      return 2;
    } else return 0;
  };

  const placeShipsButton = () => {
    setPlaceShips(!placeShip);
  };

  function colorByState(state: number) {
    if (state == 0) {
      return "#3d3d3d";
    } else if (state == 1) {
      return "#bb1010";
    }
  }

  return (
    <>
      {gameStarted &&
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >Game has started!
        </h1>}
      <div>
        <button
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "eventToggler",
            })
          }
        >
          Toggle
        </button>

        <button
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "eventToggler2",
            })
          }
        >
          Toggle back
        </button>

        <button
          onClick={() =>
            sendTransaction({
              to: "0x71b604B6C2F41Fa91Dd0e3e41221C9c6c6c75313",
              value: parseEther("0.1"),
            })
          }
        >
          Send Transaction
        </button>

        <button
          onClick={() =>
            writeContract({
              abi,
              address: contractAddress,
              functionName: "join",
              args: [playerData, shipsArray],
            })
          }
        >
          Join a game!
        </button>

        <button
          style={{
            backgroundColor: "#04AA6D",
            border: "none",
            color: "white",
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
          }}
          onClick={placeShipsButton}
        >
          <h3>Place ships</h3>
        </button>

        <p>Player1: {player1.data}</p>

        <p>Player2: {player2.data}</p>

        {player1.data && player2.data && (
          <p>Both players have joined, let the game begin!</p>
        )}

        <p>X</p>


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
                  key={`${row}-${colIndex}`} // Unique key for each cell
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid black",
                    cursor: "pointer",
                    backgroundColor: colorByState(cell), // White for empty, black for ship
                  }}
                >
                  <button
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
