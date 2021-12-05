import { createMachine, interpret } from "xstate";
import { Ship, ShipType, Score } from './types';
import type { Context } from "react";
import { createContext } from 'react';
import toast from "react-hot-toast";
import { capitalize } from "./utils";

export interface GameContext {
  alignments: string[],
  columns: number[],
  rows: string[],
  shots: number,
  mode: {
    'easy': number,
    'medium': number,
    'hard': number,
  },
  availablePositions: string[],
  hits: string[],
  missedShots: string[],
  ships: Ship[],
  sinkedPositions: string[];
  settings: {
    shipTypes: ShipType[]
  },
  scores: Score[]
}

type GameState =
  | {
      value: 'not_started';
      context: GameContext
    }
  | {
      value: 'finished';
      context: GameContext;
    }
  | {
      value: 'started';
      context: GameContext
    };


export type GameEvent =
  | { type: string }
  | { type: "START" }
  | { type: "GO_TO_EASY" }
  | { type: "GO_TO_MEDIUM" }
  | { type: "GO_TO_HARD" }
  | { type: "ADD_MISSED_SHOT" }
  | { type: "ADD_SHOT" }
  | { type: "REMOVE_SHOT" }
  | { type: "SAVE_HIT" }
  | { type: "SAVE_HIT_ON_SHIP" }
  | { type: "FINISH" };

const initialContext: GameContext = {
  alignments: ['horizontal', 'vertical'],
  columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  shots: Infinity,
  mode: {
    easy: Infinity,
    medium: 100,
    hard: 10,
  },
  availablePositions: [],
  hits: [],
  missedShots: [],
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
  },
  scores: []
}

function getShips(shipTypes: ShipType[]) {
  return shipTypes.reduce((allShips : Ship[], shipType: ShipType): Ship[] => {
    const newShips: Ship[] = new Array(shipType.amount).fill({}).map(_ => {
      return new Ship(shipType.size);
    });
    
    allShips.push(...newShips);
    return allShips;
  }, []);
}

function getRandomNumber(max: any) {
  return Math.floor((Math.random() * (max - 1)));
}

function getAvailablePositions(ctx: any) {
  let positions = [];

  for (let r = 0; r < ctx.rows.length; r++) {
    for (let c = 0; c < ctx.columns.length; c++) {
      positions.push(ctx.rows[r] + ',' + ctx.columns[c]);
    }
  }

  return positions;
}

function lookIfAllPositionsAreAvailable(ctx: any, fullPosition: any, randomAlignment: any) {
  const separator   = fullPosition.indexOf(':');
  const rowStart    = fullPosition.slice(0, 1);
  const rowEnd      = fullPosition.slice(separator+1, separator+2);
  const columnStart = fullPosition.slice(separator-1, separator);
  const columnEnd   = fullPosition.slice(separator+3, fullPosition.length);
  let positionsList = [];

  if (randomAlignment === 'horizontal') {
    for (let i = columnStart; i <= columnEnd; i++) {
      if (ctx.availablePositions.includes(rowStart + ',' + i)) {
        positionsList.push(rowStart + ',' + i);
      } else {
        break;
      }
    }
  }

  if (randomAlignment === 'vertical') {
    let rowStartNumber = ctx.rows.indexOf(rowStart);
    let rowEndNumber = ctx.rows.indexOf(rowEnd);

    if (rowStartNumber > rowEndNumber) {
      let rowStart = rowStartNumber;

      rowStartNumber = rowEndNumber;
      rowEndNumber   = rowStart;
    }

    for (let i = rowStartNumber; i <= rowEndNumber; i++) {
      if (ctx.availablePositions.includes(ctx.rows[i] + ',' + columnStart)) {
        positionsList.push(ctx.rows[i] + ',' + columnStart);
      } else {
        break;
      }
    }
  }

  return positionsList;
}

function cleanAvailablePositions(positionList: any, availablePositions: any) {
  let newAvailablePositions = [...availablePositions];

  positionList
    .forEach((position: any) => {
      let index = newAvailablePositions.indexOf(position);
      newAvailablePositions.splice(index, 1);
    });

  return newAvailablePositions;
}

function generateShipPosition(ctx: any, ship: Ship): Ship {
  let newShip = {...ship};
  const randomRow       = ctx.rows[getRandomNumber(10)];
  const randomColumn    = ctx.columns[getRandomNumber(10)];
  const randomAlignment = ctx.alignments[getRandomNumber(3)];

  const startPosition = randomRow + ',' + randomColumn;
  const endPosition   = (randomAlignment === 'horizontal')
    ? randomRow + ',' + (randomColumn + newShip.size - 1)
    : ctx.rows[getRandomNumber(10 + newShip.size - 1)] + ',' + randomColumn;
  const fullPosition  = startPosition + ':' + endPosition;
  const positionsList = lookIfAllPositionsAreAvailable(ctx, fullPosition, randomAlignment);

  if (positionsList.length === newShip.size) {
    newShip.position = fullPosition;
    newShip.positionsList = positionsList;

    ctx.availablePositions = cleanAvailablePositions(positionsList, ctx.availablePositions);

    return newShip;
  } else {
    return generateShipPosition(ctx, newShip);
  }
}

const gameMachine = createMachine<GameContext, GameEvent, GameState>({
  id: 'game',
  initial: 'not_started',
  context: initialContext,
  states: {
    not_started: {
      initial: 'easy',
      entry: ["setShips", "setAvailablePositions"],
      on: {
        START: 'started', 
        GO_TO_EASY: 'not_started.easy',
        GO_TO_MEDIUM: 'not_started.medium',
        GO_TO_HARD: 'not_started.hard',
      },
      states: {
        easy: {
          entry: ["setMode"],
        },
        medium: {
          entry: ["setMode"],
        },
        hard: {
          entry: ["setMode"],
        },
      }
    },
    started: {
      entry: ["setShipsRandomly"],
      on: { 
        FINISH: 'finished' ,
        ADD_MISSED_SHOT: {
          actions: ['saveMissedShot']
        },
        SAVE_HIT: {
          actions: [
            'removeShot',
            'saveHit',
            'saveMissedShot', 
            'saveHitOnShip',
            'shipHasBeenSinked'
          ]
        },
      },
    },
    finished: {
      entry: [
        'saveScore',
        'finishGame',
        // 'cleanBoard'
      ],
      // after: {
      //   3000: { target: 'not_started' }
      // }
    }
  }
}, {
  actions: {
    cleanBoard: (ctx, e: any) => {
      ctx.shots = Infinity;
      ctx.availablePositions = [];
      ctx.hits = [];
      ctx.missedShots = [];
      ctx.ships = [];
      ctx.sinkedPositions = [];
    },
    shipHasBeenSinked: (ctx, e: any) => {
      const sinked = ctx.ships.some(
        (ship: Ship) => ship.size === ship.hitCount && ship.position.includes(e.position)
      );

      if (sinked) {
        toast('Ship sinked!', {
          icon: '👏',
        });
      }

      console.log('>>> ctx', ctx)
    },
    saveHitOnShip: (ctx, e: any) => {
      const ships = ctx.ships.map((ship: Ship) => ({
        ...ship,
        hitCount: ship.positionsList.includes(e.position) && ship.size !== ship.hitCount
          ? ship.hitCount + 1
          : ship.hitCount 
      }));

      ships.forEach(ship => {
        if (ship.size === ship.hitCount) {
          // @ts-ignore
          ctx.sinkedPositions = [...new Set([
            ...ctx.sinkedPositions,
            ...ship.positionsList,
          ])];
        }        
      });

      ctx.ships = ships;
    },
    saveHit: (ctx, e: any) => {
      if (!ctx.availablePositions.includes(e.position)) {
        // @ts-ignore
        ctx.hits = [...new Set(
          [...ctx.hits, e.position]
        )];
      }
    },
    saveScore: (ctx, e: any) => {
      const sinkedShips = ctx.ships.reduce((counter : number, ship: Ship): number => {
        if (ship.size === ship.hitCount) {
          return counter + 1;
        }
        
        return counter;
      }, 0);

      ctx.scores = [
        ...ctx.scores,
        {
          sinkedShips: sinkedShips,
          hits: ctx.hits.length,
          missedShots: ctx.missedShots.length,
        }
      ]
    },
    finishGame: (ctx, e: any) => {
      toast('Game over, you ' + e.msg, {
        icon: '✌️',
      });
    },
    saveMissedShot: (ctx, e: any) => {
      if (ctx.availablePositions.includes(e.position)) {
        ctx.missedShots = [...ctx.missedShots, e.position];
      }
    },
    removeShot: (ctx, e: any) => {
      if (
        !ctx.missedShots.includes(e.position) &&
        !ctx.hits.includes(e.position)
      ) {
        ctx.shots = ctx.shots - 1;
      }
    },
    setMode: (ctx: any, e: any) => {
      ctx.shots = ctx.mode[e.mode || "easy"];
      toast.success(capitalize(e.mode || "easy") + ' mode selected')
    },
    setShips: (ctx, e: any) => {
      const ships: Ship[] = getShips(ctx.settings.shipTypes);
      ctx.ships = ships;
    },
    setAvailablePositions: (ctx, e: any) => {
      const availablePositions = getAvailablePositions(ctx);
      ctx.availablePositions = availablePositions;
    },
    setShipsRandomly: (ctx, e: any) => {
      const newShipsState = [...ctx.ships].map(ship => generateShipPosition(ctx, ship));
      ctx.ships = newShipsState;
    },
  }
});

export default gameMachine;

export const GameMachineContext: Context<any> = createContext<any>(
  null
);

export const GameMachineService = interpret(gameMachine);
GameMachineService.start();
