interface GameStateEvent {
  args: {
    started: boolean;
  };
}

export interface GameStartedEvent extends GameStateEvent {}
export interface BothPlayersPlacedShipsEvent extends GameStateEvent {}

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
  };
}
