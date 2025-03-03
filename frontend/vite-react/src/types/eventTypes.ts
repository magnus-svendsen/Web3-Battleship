export interface BothPlayersPlacedShipsEvent {
  args: {
    placed: boolean;
  };
}

interface PlayerEvent {
  args: {
    player: string;
  };
}

export interface PlayerJoinedEvent extends PlayerEvent {}
export interface ShipPlacementEvent extends PlayerEvent {}

export interface MoveResultEvent {
  args: {
    pos: number;
    player: string;
    hit: boolean;
    gameOver: boolean;
  };
}
