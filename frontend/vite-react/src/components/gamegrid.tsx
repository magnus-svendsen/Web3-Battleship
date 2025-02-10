import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useSendTransaction,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { abi } from "../utils/abi";
import { contractAddress } from "../utils/contractAddress";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import type { GridData } from "../types/gridTypes";
import type { ShipDataContract } from "../types/shipTypes";
import Ship from "./ship";
import DroppableGridCell from "./cell";

function GameGrid() {
  const { writeContract } = useWriteContract();

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

  const gameStartedEvent = useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "GameStarted",
  });

  useEffect(() => {
    // DEBUGGING
    console.log("gameStartedEvent", gameStartedEvent);
  }, [grid]);

  /** 

  useEffect(() => {
    /** 
    console.log('result', result)
    console.log('transaction', transaction.data)
    console.log('account', account)
    console.log('account', account.addresses)
    console.log('transactionCount', transactionCount.data)
    */
  //}, [transaction, result])**/

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
      <div>
        <button
          onClick={() =>
            sendTransaction({
              to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
              value: parseEther("0.00001"),
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

        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default GameGrid;
