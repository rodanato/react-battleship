import { Ship } from "./types";

const types = {
  SET_SHIPS: 'SET_SHIPS',
  UPDATE_AVAILABLE_POSITIONS: 'UPDATE_AVAILABLE_POSITIONS',
};

const actions = {
  setShips: (ships: Ship[]) => ({
    type: types.SET_SHIPS,
    payload: ships,
  }),
  updateAvailablePositions: (positions: string[]) => ({
    type: types.UPDATE_AVAILABLE_POSITIONS,
    payload: positions,
  }),
};

export {
  types,
  actions,
};
