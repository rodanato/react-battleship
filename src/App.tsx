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
        <Link to="/">Game</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/scores">Scores</Link>
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
  const [, send] = useActor(GameMachineService);
  
  return (
    <div>
      <h2>Settings</h2>

      <button onClick={() => send({type: 'GO_TO_EASY', mode: 'easy'})}>GO TO EASY</button> 
      <button onClick={() => send({ type: 'GO_TO_MEDIUM', mode: 'medium'})}>GO TO MEDIUM</button>  
      <button onClick={() => send({type: 'GO_TO_HARD', mode: 'hard'})}>GO TO HARD</button>  
    </div>
  );
}

function Scores() {
  const GameMachineService = useContext(GameMachineContext);
  const [state] = useActor<any, any>(GameMachineService);

  return (
    <div>
      <h2>Scores</h2>

      {
        state.context.scores
          .sort((a: Score, b: Score) => a.sinkedShips - b.sinkedShips)
          .map((score: Score) => (
          <ul key={getUniqueID()}>
            <li>Sinked ships: {score.sinkedShips}</li>
            <li>Hits: {score.hits}</li>
            <li>Missed shots: {score.missedShots}</li>
          </ul>
        ))
      }

    </div>
  );
}