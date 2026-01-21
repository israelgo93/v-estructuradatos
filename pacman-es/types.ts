
export type Point = {
  x: number;
  y: number;
};

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  PELLET = 2,
  POWER_PELLET = 3,
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  NONE = 'NONE'
}

export interface GhostState {
  id: string;
  position: Point;
  color: string;
  direction: Direction;
  isFrightened: boolean;
  type: 'blinky' | 'pinky' | 'inky' | 'clyde';
}

export interface GameState {
  pacmanPos: Point;
  pacmanDir: Direction;
  score: number;
  lives: number;
  maze: TileType[][];
  ghosts: GhostState[];
  isGameOver: boolean;
  isPaused: boolean;
  isWin: boolean;
  powerMode: number; // Ticks remaining for power mode
}
