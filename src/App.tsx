import { useEffect, useState } from "react";
// import type { TcharacterState } from "./components/Characters/Character";
import Camera from "./components/Camera/Camera";
import Map from "./components/Map/Map";
import Character from "./components/Characters/Character";
import Player from "./components/Characters/Player";
import { useGameContext } from "./hooks/useGameContext";
// import { gridCell } from "./utils/grid";
// import { getMapBoundaries, getMapCollisions } from "./utils/collisions";
// import { demoCollisionMap } from "./maps/Demo/collisionMap";
import styles from "./App.module.css";

// export type TGameState = { 
// 	mapSrc: string,
// 	player: TcharacterState,
// 	npcs: TcharacterState[],
// 	walls: { [key: string]: boolean }
// };

export default function App() {
	const [step, setStep] = useState<number>(0);
	// const [gameState, _setGameState] = useState<TGameState>(gameInitialState);
	const { gameState } = useGameContext();

	// const startStep = () => {
	// 	setStep(prevState => prevState === 1 ? 0 : 1)
	// 	// console.log("step");

	// 	setTimeout(() => {
	// 		startStep();
	// 	}, 1000 );
	// };

	// console.log("render");

	useEffect(() => {
		// startStep();

		const stepTimeout = setInterval(() => {
				setStep(prevState => prevState === 1 ? 0 : 1);
		}, 1000 / 35);

		return () => clearInterval(stepTimeout)
	}, []);

	return (
		<div className={styles.background}>
			<Camera>
				{/* <Map gameState={gameState}> */}
				<Map>
					<Player 
						step={step}
						isPlayer={true}
						// gameState={gameState}
						// gameStateSetter={setGameState}
					/>
					{
						gameState?.npcs.map((_item, index) => (
							<Character
								key={index}
								step={step}
								isPlayer={false}
								index={index}
								// gameState={gameState}
								// gameStateSetter={setGameState}
							/>
						))
					}
				</Map>
			</Camera>
		</div>
	)
};
