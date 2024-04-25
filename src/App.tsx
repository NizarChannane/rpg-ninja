import { useEffect, useState } from "react";
import Camera from "./components/Camera/Camera";
import Map from "./components/Map/Map";
import Character from "./components/Characters/Character";
import Player from "./components/Characters/Player";
import type { TcharacterState } from "./components/Characters/Character";
import { gridCell } from "./utils/grid";
import { getMapBoundaries, getMapCollisions } from "./utils/collisions";
import { demoCollisionMap } from "./maps/Demo/collisionMap";
import styles from "./App.module.css";

export type TGameState = { 
	mapSrc: string,
	player: TcharacterState,
	npcs: TcharacterState[],
	walls: { [key: string]: boolean }
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


export default function App() {
	const [step, setStep] = useState<number>(0);
	const [gameState, _setGameState] = useState<TGameState>(gameInitialState);

	const startStep = () => {
		setStep(prevState => prevState === 1 ? 0 : 1)
		// console.log("step");

		setTimeout(() => {
			startStep();
		}, 1000 / 60);
	};

	useEffect(() => {
		startStep();
	}, []);

	return (
		<div className={styles.background}>
			<Camera>
				<Map gameState={gameState}>
					<Player 
						step={step}
						isPlayer={true}
						gameState={gameState}
						// gameStateSetter={setGameState}
					/>
					{
						gameState?.npcs.map((_item, index) => (
							<Character
								key={index}
								step={step}
								isPlayer={false}
								index={index}
								gameState={gameState}
								// gameStateSetter={setGameState}
							/>
						))
					}
				</Map>
			</Camera>
		</div>
	)
};
