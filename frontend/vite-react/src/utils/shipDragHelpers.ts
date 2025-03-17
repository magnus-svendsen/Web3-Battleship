export const getIntendedCoordinates = (
  activeId: string,
  overId: string | undefined,
  lengthByID: (id: number) => number,
  shipOrientations: boolean[]
): [number, number][] => {
  const shipID = Number(activeId) - 1;
  const lengthOfShip = lengthByID(Number(activeId));
  // Expect the over id to be in a format like "cell-<row>-<col>"
  const parts = overId ? overId.split("-") : [];
  if (parts.length < 3) return [];
  const row = Number(parts[1]);
  const col = Number(parts[2]);
  const coordinates: [number, number][] = [];

  if (!shipOrientations[shipID]) {
    // Horizontal placement:
    if (col + lengthOfShip > 10) return [];
    for (let c = col; c < col + lengthOfShip; c++) {
      coordinates.push([row, c]);
    }
  } else {
    // Vertical placement:
    if (row + lengthOfShip > 10) return [];
    for (let r = row; r < row + lengthOfShip; r++) {
      coordinates.push([r, col]);
    }
  }
  return coordinates;
};
