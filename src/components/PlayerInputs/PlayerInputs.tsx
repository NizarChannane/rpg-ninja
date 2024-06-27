import { useEffect } from "react";
import type { TcharacterState } from "../Characters/Character";
import { directions } from "../../utils/inputs";

type TkeyCodes = { [key: string]: string; };

type TPlayerInputsProps = {
    children: JSX.Element,
    playerState: TcharacterState
};

const keyCodes: TkeyCodes = {
    "ArrowUp": directions.up,
    "ArrowLeft": directions.left,
    "ArrowRight": directions.right,
    "ArrowDown": directions.down,
};

export default function PlayerInputs({ children, playerState }: TPlayerInputsProps) {

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