import React, { useContext } from 'react';
import { useActor } from '@xstate/react';
import { GameMachineService, GameMachineContext } from './game/game.machine';
import './App.css';
import {
  Link,
  Routes,
  Route
} from "react-router-dom";
import { Game } from './game';
import { Toaster } from 'react-hot-toast';
import { Score } from './game/types';
import { getUniqueID } from './game/utils';

export default function App() {
  return (
    <>
      <Toaster/>

      <nav>
        <Link to="/">Juego</Link>
        <Link to="/settings">Configuración</Link>
        <Link to="/scores">Puntajes</Link>
      </nav>

      <GameMachineContext.Provider value={GameMachineService}>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scores" element={<Scores />} />
        </Routes>
      </GameMachineContext.Provider>
    </>
  );
}


function Settings() {
  const GameMachineService = useContext(GameMachineContext);
  const [state, send] = useActor<any, any>(GameMachineService);
  
  return (
    <div>
      <h2>Configuración</h2>

      <h3>Elegir dificultad</h3>
      
      <label>
        <input
          type="radio" 
          disabled={!state.matches('not_started')}
          name="setMode"
          onClick={() => send({type: 'GO_TO_EASY', mode: 'easy'})} />
        EASY
      </label> 
      <br/>

      <label>
        <input
          type="radio" 
          disabled={!state.matches('not_started')}
          name="setMode"
          onClick={() => send({ type: 'GO_TO_MEDIUM', mode: 'medium'})} />
        MEDIUM
      </label>  
      <br/>

      <label>
        <input type="radio" 
          disabled={!state.matches('not_started')}
          name="setMode"
          onClick={() => send({type: 'GO_TO_HARD', mode: 'hard'})} />
        HARD
      </label>  
    </div>
  );
}

function Scores() {
  const GameMachineService = useContext(GameMachineContext);
  const [state] = useActor<any, any>(GameMachineService);

  return (
    <div>
      <h2>Mejores puntajes</h2>

      {
        state.context.scores
          .sort((a: Score, b: Score) => b.sinkedShips - a.sinkedShips)
          .map((score: Score, i: number) => (
          <ul key={getUniqueID(i)}>
            <li>Barcos hundidos: {score.sinkedShips}</li>
            <li>Tiros acertados: {score.hits}</li>
            <li>Tiros fallados: {score.missedShots}</li>
          </ul>
        ))
      }

    </div>
  );
}