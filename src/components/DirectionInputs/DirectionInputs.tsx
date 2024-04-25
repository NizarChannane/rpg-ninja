import { useEffect } from "react";
import type { TcharacterState } from "../Characters/Character";
import { directions } from "../../utils/directions";

type TkeyCodes = { [key: string]: string; };

type TDirectionInputsProps = {
    children: JSX.Element,
    playerState: TcharacterState
};

export default function DirectionInputs({ children, playerState }: TDirectionInputsProps) {
    const keyCodes: TkeyCodes = {
        "ArrowUp": directions.up,
        "ArrowLeft": directions.left,
        "ArrowRight": directions.right,
        "ArrowDown": directions.down,
    };

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