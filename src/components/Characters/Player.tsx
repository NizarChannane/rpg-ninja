// import { useEffect } from "react";
// import styles from "./PlayerCharacter.module.css";
// import characterWalkSpritesheet from "../../../assets/Walk.png";
// import characterShadow from "../../../assets/Shadow.png";
// import { gridCell } from "../../../utils/grid";
import type { TCharacterProps } from "./Character";
import Character from "./Character";
import PlayerInputs from "../PlayerInputs/PlayerInputs";
import { useGameContext } from "../../hooks/useGameContext";

export default function Player(props: TCharacterProps) {
	const { gameState } = useGameContext();

	return (
		<PlayerInputs playerState={gameState.player}>
			<Character {...props} />
		</PlayerInputs>
	)
};