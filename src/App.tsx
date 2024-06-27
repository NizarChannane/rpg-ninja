import { useEffect, useState } from "react";
import Camera from "./components/Camera/Camera";
import Map from "./components/Map/Map";
import Character from "./components/Characters/Character";
import Player from "./components/Characters/Player";
import { useGameContext } from "./hooks/useGameContext";
import styles from "./App.module.css";



export default function App() {
	const [step, setStep] = useState<number>(0);
	const { gameState } = useGameContext();



	useEffect(() => {
		const stepTimeout = setInterval(() => {
				setStep(prevState => prevState === 1 ? 0 : 1);
		}, 1000 / 35);

		return () => clearInterval(stepTimeout)
	}, []);

	return (
		<div className={styles.background}>
			<Camera>
				<Map>
					<Player 
						step={step}
						isPlayer={true}
					/>
					{
						gameState?.npcs.map((_item, index) => (
							<Character
								key={index}
								step={step}
								isPlayer={false}
								index={index}
							/>
						))
					}
				</Map>
			</Camera>
		</div>
	)
};
