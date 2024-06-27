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