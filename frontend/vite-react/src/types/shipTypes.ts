export interface ShipData {
  id: number,
  length: number
}

export interface ShipDataOrientation {
  id: number,
  length: number,
  isHorizontal: boolean
}

export interface ShipDataContract {
  length: number,
  timesHit: number,
  isDestroyed: boolean,
  coordinates: number[][]
}