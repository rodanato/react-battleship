
export class Ship {
  size: number = 0;
  position: string = '';
  hitCount: number = 0;
  positionsList: string[] = [];
  
  constructor (startSize: number) {
    this.size = startSize;
  }
}

export interface ShipType {
  size: number;
  amount: number;
}

export interface GameState {
  availablePositions: string[];
  hits: string[];
  missedShots: string[];
  playing: boolean;
  ships: Ship[];
  sinkedPositions: string[];
  settings: {
    shipTypes: ShipType[];
  }
}

export interface Score {
  sinkedShips: number;
  hits: number;
  missedShots: number;
}
