import { createContext, useReducer, ReactNode, Dispatch } from "react";
import type { TcharacterState } from "../components/Characters/Character";
import { gridCell } from "../utils/grid";
import { getMapBoundaries, getMapCollisions } from "../utils/collisions";
import { demoCollisionMap } from "../maps/Demo/collisionMap";

type TGameState = {
	mapSrc: string,
	player: TcharacterState,
	npcs: TcharacterState[],
	walls: { [key: string]: boolean },
	hitboxes: { [key: string]: boolean }
};

type TGameStateContext = {
    gameState: TGameState
    dispatch: Dispatch<any>
};

type TupdateAction = {
    type: "UPDATE",
    payload: TGameStateContext
}

type TGameStateContextProviderProps = {
    children: ReactNode
};

const gameInitialState: TGameState = {
	mapSrc: "",
	player: {
		// id: 0,
		coord: {
			x: gridCell(19),
			y: gridCell(14)
		},
		held_directions: [],
		movingProgressRemaining: 0,
		facing: "up",
		walking: "false",
		speed: 1,
		characterWidth: 16,
		characterHeight: 16
	},
	npcs: [
		{
			id: 0,
			coord: {
				x: gridCell(21),
				y: gridCell(17)
			},
			held_directions: [],
			movingProgressRemaining: 0,
			facing: "down",
			walking: "false",
			speed: 1,
			behaviorLoop: [
				{ type: "walk", direction: "left" },
				{ type: "walk", direction: "left" },
				{ type: "walk", direction: "left" },
				{ type: "stand", direction: "left", time: 1000 },
				{ type: "walk", direction: "down" },
				{ type: "walk", direction: "down" },
				{ type: "stand", direction: "down", time: 1500 },
				{ type: "walk", direction: "right" },
				{ type: "walk", direction: "right" },
				{ type: "walk", direction: "right" },
				{ type: "stand", direction: "right", time: 1500 },
				{ type: "walk", direction: "up" },
				{ type: "walk", direction: "up" },
				{ type: "stand", direction: "up", time: 1000 }
			],
			behaviorIndex: 0,
			characterWidth: 16,
			characterHeight: 16
		}, {
			id: 1,
			coord: {
				x: gridCell(21),
				y: gridCell(12)
			},
			held_directions: [],
			movingProgressRemaining: 0,
			facing: "down",
			walking: "false",
			speed: 2,
			behaviorLoop: [
				{ type: "stand", direction: "down", time: 1000 },
				{ type: "stand", direction: "left", time: 2000 },
				{ type: "stand", direction: "down", time: 1500 },
				{ type: "stand", direction: "right", time: 2000 },
				{ type: "stand", direction: "down", time: 1000 }
			],
			behaviorIndex: 0,
			characterWidth: 16,
			characterHeight: 16
		}
	],
	walls: {
		...getMapBoundaries(40, 23),
		...getMapCollisions(demoCollisionMap)
	},
	hitboxes: {}
}

export const GameStateContext = createContext<TGameStateContext>({
    gameState: gameInitialState,
    dispatch: () => null
});

const reducer = (state: TGameState, _action: TupdateAction) => {
    return state;
};

export default function GameStateContextProvider({ children }: TGameStateContextProviderProps) {
    const [state, dispatch] = useReducer(reducer, gameInitialState);

    return (
        <GameStateContext.Provider value={{ gameState: { ...state }, dispatch }}>
            {children}
        </GameStateContext.Provider>
    )
};