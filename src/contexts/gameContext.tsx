import { createContext, useReducer, ReactNode, Dispatch } from "react";
import type { TcharacterState } from "../components/Characters/Character";
import { gridCell } from "../utils/grid";
import { getMapBoundaries, getMapCollisions } from "../utils/collisions";
import { demoCollisionMap } from "../maps/Demo/collisionMap";

type TGameState = {
	mapSrc: string,
	player: TcharacterState,
	npcs: TcharacterState[],
	walls: { [key: string]: boolean }
};

type TGameStateContext = TGameState & {
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
		speed: 2,
		characterWidth: 16,
		characterHeight: 16
	},
	npcs: [
		{
			id: 0,
			coord: {
				x: gridCell(20),
				y: gridCell(17)
			},
			held_directions: [],
			movingProgressRemaining: 0,
			facing: "down",
			walking: "false",
			speed: 2,
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
			characterWidth: 16,
			characterHeight: 16
		}
	],
	walls: {
		...getMapBoundaries(40, 23),
		...getMapCollisions(demoCollisionMap)
	}
}

export const GameStateContext = createContext<TGameStateContext>({
    ...gameInitialState,
    dispatch: () => null
});

const reducer = (state: TGameState, action: TupdateAction) => {
    console.log(action);
    return state;
};

export default function GameStateContextProvider({ children }: TGameStateContextProviderProps) {
    const [state, dispatch] = useReducer(reducer, gameInitialState);

    return (
        <GameStateContext.Provider value={{ ...state, dispatch }}>
            {children}
        </GameStateContext.Provider>
    )
};