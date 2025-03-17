import type { Coordinate } from "../types/coordinate";

export const intToCoordinate = (value: number): Coordinate => {
  const x = Math.floor(value / 10);
  const y = value % 10;
  return { x, y }
}