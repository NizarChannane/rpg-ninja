import { useEffect } from "react";
import type { TcharacterState } from "../Characters/Character";
import { directions } from "../../utils/directions";
// import { useGameContext } from "../../hooks/useGameContext";

type TkeyCodes = { [key: string]: string; };

type TDirectionInputsProps = {
    children: JSX.Element,
    playerState: TcharacterState
};

const keyCodes: TkeyCodes = {
    "ArrowUp": directions.up,
    "ArrowLeft": directions.left,
    "ArrowRight": directions.right,
    "ArrowDown": directions.down,
};

export default function DirectionInputs({ children, playerState }: TDirectionInputsProps) {
    // const { gameState, dispatch } = useGameContext();

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
			let dir = keyCodes[e.code];
			if(dir && playerState.held_directions.indexOf(dir) === -1) {
				playerState.held_directions.unshift(dir);
			};
		});

		document.addEventListener("keyup", (e) => {
			let dir = keyCodes[e.code];
			let index = playerState.held_directions.indexOf(dir);
			if(index > -1) {
				playerState.held_directions.splice(index, 1);
			};
		});
    }, []);

    return (
        <>{children}</>
    )
}