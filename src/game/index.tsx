import { useActor } from '@xstate/react';
import React, { useContext, useEffect } from 'react';
import { GameMachineContext } from './game.machine';

import Grid from './grid';
import { Ship } from './types';

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
    columns,
    scores
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

  useEffect(() => {
    if (allShipsHaveBeenRemoved()) finishGame('ganaste');
  }, [ships]);

  useEffect(() => {
    if (shots === 0) finishGame('perdiste');
  }, [shots]);

  return (
    <div>
      <h2>Juego {state.matches('started') ? 'iniciado': 'no iniciado'}</h2>

      <h3>Disparos restantes: {shots}</h3>

      {
        state.matches('not_started') &&
        <button onClick={() => send('START')}>
          {scores.length > 0 ? 'Intentar de nuevo' : 'Iniciar juego'} 
        </button>
      }  
 
      <Grid
        rows={rows}
        columns={columns}
        hits={hits}
        missedShots={missedShots}
        sinkedPositions={sinkedPositions}
        shotAction={shotAction}
      />
    </div>
  );
}