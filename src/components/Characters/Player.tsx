// import { useEffect } from "react";
// import styles from "./PlayerCharacter.module.css";
// import characterWalkSpritesheet from "../../../assets/Walk.png";
// import characterShadow from "../../../assets/Shadow.png";
// import { gridCell } from "../../../utils/grid";
import Character from "./Character";
import DirectionInputs from "../DirectionInputs/DirectionInputs";
import type { TCharacterProps } from "./Character";

export default function Player(props: TCharacterProps) {

	return (
		<DirectionInputs playerState={props.gameState.player}>
			<Character {...props} />
		</DirectionInputs>
	)
};