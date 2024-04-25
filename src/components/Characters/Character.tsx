import { useEffect, useState } from "react";
import type { TGameState } from "../../App";
import { isSpaceTaken } from "../../utils/collisions";
import { gridCell } from "../../utils/grid";
import styles from "./Character.module.css";
import characterWalkSpritesheet from "../../assets/Walk.png";
import characterShadow from "../../assets/Shadow.png";

type TdirectionUpdates = {
	[x: string]: [string, number];
};

export type TcharacterState = {
	id?: number,
	coord: {
		[x: string]: number,
		y: number
	},
	held_directions: string[],
	movingProgressRemaining: number,
	facing: string,
	walking: string,
	speed: number,
	characterWidth: number,
	characterHeight: number
};

export type TCharacterProps = {
    step: number,
    gameState: TGameState,
    // gameStateSetter: Dispatch<SetStateAction<TGameState>>
} & ({
    isPlayer: true,
} | {
    isPlayer: false,
    index: number,
});

const directions = {
	up: "up",
	down: "down",
	left: "left",
	right: "right",
};

const directionUpdates: TdirectionUpdates = {
	[directions.up]: ["y", -1],
	[directions.down]: ["y", 1],
	[directions.left]: ["x", -1],
	[directions.right]: ["x", 1]
};

const defaultCharacterState: TcharacterState = {
    // id: 0,
    coord: {
        x: gridCell(0),
        y: gridCell(0)
    },
    held_directions: [],
    movingProgressRemaining: 0,
    facing: "down",
    walking: "false",
    speed: 2,
    characterWidth: 16,
    characterHeight: 16
}

export default function Character(props: TCharacterProps) {
    const initialState = props.isPlayer ? 
                            props.gameState.player 
                            : props.index ? 
                                props.gameState.npcs[props.index] 
                                : defaultCharacterState
    const [characterState, setCharacterState] = useState<TcharacterState>(initialState);

	// const NPCMove = (prevState: TcharacterState): TcharacterState => {
	// 	let coordUpdate = prevState.coord;
	// 	let progressUpdate = prevState.movingProgressRemaining;
	// 	let facingUpdate = prevState.facing;
	// 	let walkingUpdate = prevState.walking;

	// 	if(progressUpdate > 0) {
	// 		walkingUpdate = "true";
	// 		const [property, change] = directionUpdates[prevState.facing];
	// 		coordUpdate[property] += change;
	// 		progressUpdate -= 1;
	// 	};

	// 	if(progressUpdate === 0) {
	// 		walkingUpdate = "false";
	// 	}

	// 	return {
	// 		...prevState,
	// 		coord: coordUpdate,
	// 		movingProgressRemaining: progressUpdate,
	// 		facing: facingUpdate,
	// 		walking: walkingUpdate
	// 	};
	// }

    // const startBehavior = () => {
        
    // }

    const walk = () => {
        setCharacterState((prevState) => {
            let coordUpdate = prevState.coord;
            let progressUpdate = prevState.movingProgressRemaining;
            let facingUpdate = prevState.facing;
            let walkingUpdate = prevState.walking;

            if(progressUpdate > 0) {
                walkingUpdate = "true";
                const [property, change] = directionUpdates[prevState.facing];
                coordUpdate[property] += (change * prevState.speed);
                progressUpdate -= prevState.speed;
            }

            if(progressUpdate === 0 && prevState.held_directions[0]) {
                facingUpdate = prevState.held_directions[0];
                // console.log(isSpaceTaken(
                //     coordUpdate.x, coordUpdate.y, facingUpdate, props.gameState.walls
                // ));
                if(!isSpaceTaken(coordUpdate.x, coordUpdate.y, facingUpdate, props.gameState.walls)) {
                    progressUpdate = gridCell(1);
                }
            };

            if(progressUpdate === 0 && !prevState.held_directions[0]) {
                walkingUpdate = "false";
            }

            return {
                ...prevState,
                coord: coordUpdate,
                movingProgressRemaining: progressUpdate,
                facing: facingUpdate,
                walking: walkingUpdate
            };
        });
    };

	const updatePosition = () => {
        walk();
	};

    useEffect(() => {
        if(props.isPlayer) {
            setCharacterState(props.gameState.player);
        } else {
            setCharacterState(props.gameState.npcs[props.index])
        };

    }, [props.gameState]);

	useEffect(() => {
		updatePosition();
	}, [props.step]);

	return (
		<div 
			className={styles.character}
			data-facing={characterState.facing}
			data-walking={characterState.walking}
			style={{
				transform: `translate3d( ${characterState.coord.x}px, ${characterState.coord.y}px, 0 )`
			}}
		>
			<img 
				className={styles.character_shadow}
				src={characterShadow} 
				alt="character shadow" 
			/>
			<div className={styles.character_sprite_container}>
				<img 
					className={`${styles.character_spritesheet}`} 
					src={characterWalkSpritesheet} 
					alt="character"
				/>
			</div>
		</div>
	)
};