import { types } from "./actions";
import { GameState } from "./types";

export const initialState: GameState = {
  availablePositions: [],
  hits: [],
  missedShots: [],
  playing: false,
  ships: [],
  sinkedPositions: [],
  settings: {
    shipTypes: [
      {
        size: 4,
        amount: 1,
      },
      {
        size: 3,
        amount: 2,
      },
      {
        size: 2,
        amount: 3,
      },
      {
        size: 1,
        amount: 4,
      },
    ]
  }
}

export function reducer(state: GameState, action: any) {
  switch (action.type) {
    case types.SET_SHIPS:
      return {
        ...state,
        ships: action.payload,
      };
    case types.UPDATE_AVAILABLE_POSITIONS:
      return {
        ...state,
        availablePositions: action.payload,
      };
    default:
      throw new Error();
  }
}
