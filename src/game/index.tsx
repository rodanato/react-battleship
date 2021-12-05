import { useActor } from '@xstate/react';
import React, { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GameMachineContext } from './game.machine';

import Grid from './grid';
import { Ship } from './types';
import { capitalize } from './utils';

export function Game() {
  const GameMachineService = useContext(GameMachineContext);
  const [state, send] = useActor<any, any>(GameMachineService);
  const {
    shots,
    hits,
    missedShots,
    ships,
    sinkedPositions,
    rows,
    columns
  } = state.context;
  
  const allShipsHaveBeenRemoved = () => ships.every((ship: Ship) => ship.size === ship.hitCount);

  function finishGame(msg: string) {
    send({ type: "FINISH", msg});
  }

  function saveHit(position: string) {
    send({ type: "SAVE_HIT", position: position });
  }

  function shotAction(row: string, column: string) {
    if (state.matches('started')) {
      const position = row + ',' + column;
      saveHit(position);
    }
  }

  function getMode(shots: number) {
    for (let mode in state.context.mode) {
      if (state.context.mode[mode] === shots) {
        return capitalize(mode);
      }
    }

    return 'Easy';
  }

  useEffect(() => {
    if (allShipsHaveBeenRemoved()) finishGame('won');
  }, [ships]);

  useEffect(() => {
    if (shots === 0) finishGame('lost');
  }, [shots]);

  return (
    <div>
      <h2>Game {state.matches('started') ? 'started': 'not started'}</h2>

      <h3>Difficulty: {getMode(shots)}</h3>
      <h3>Shots left: {shots}</h3>

      {
        state.matches('not_started') &&
        <button onClick={() => send('START')}>Start game</button>
      }  
 
      <main>
        <Grid
          rows={rows}
          columns={columns}
          hits={hits}
          missedShots={missedShots}
          sinkedPositions={sinkedPositions}
          shotAction={shotAction}
        />
      </main>
    </div>
  );
}