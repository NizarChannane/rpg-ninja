import { useEffect } from "react";
// import type { TGameState } from "../../App";
import { useGameContext } from "../../hooks/useGameContext";
import { isSpaceTaken, addCollision, moveCollision } from "../../utils/collisions";
import { gridCell } from "../../utils/grid";
import styles from "./Character.module.css";
import characterWalkSpritesheet from "../../assets/Walk.png";
import characterShadow from "../../assets/Shadow.png";

type TdirectionUpdates = {
	[x: string]: [string, number];
};

type TbehaviorObj = {
    type: string,
    direction: string
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
    // gameState: TGameState,
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

// const defaultCharacterState: TcharacterState = {
//     // id: 0,
//     coord: {
//         x: gridCell(0),
//         y: gridCell(0)
//     },
//     held_directions: [],
//     movingProgressRemaining: 0,
//     facing: "down",
//     walking: "false",
//     speed: 2,
//     characterWidth: 16,
//     characterHeight: 16
// }

export default function Character(props: TCharacterProps) {
    // const initialState = props.isPlayer ? 
    //                         props.gameState.player 
    //                         : props.index ? 
    //                             props.gameState.npcs[props.index] 
    //                             : defaultCharacterState
    // const [characterState, setCharacterState] = useState<TcharacterState>(initialState);
    const { gameState } = useGameContext();
    const characterState = props.isPlayer ? 
                            (useGameContext()).gameState.player : 
                            (useGameContext()).gameState.npcs[props.index]

    // const walk = () => {
    //     setCharacterState((prevState) => {
    //         let coordUpdate = prevState.coord;
    //         let progressUpdate = prevState.movingProgressRemaining;
    //         let facingUpdate = prevState.facing;
    //         let walkingUpdate = prevState.walking;

    //         if(progressUpdate > 0) {
    //             walkingUpdate = "true";
    //             const [property, change] = directionUpdates[prevState.facing];
    //             coordUpdate[property] += (change * prevState.speed);
    //             progressUpdate -= prevState.speed;
    //         }

    //         if(progressUpdate === 0 && prevState.held_directions[0]) {
    //             facingUpdate = prevState.held_directions[0];
    //             // console.log(isSpaceTaken(
    //             //     coordUpdate.x, coordUpdate.y, facingUpdate, props.gameState.walls
    //             // ));
    //             if(!isSpaceTaken(coordUpdate.x, coordUpdate.y, facingUpdate, props.gameState.walls)) {
    //                 progressUpdate = gridCell(1);
    //             }
    //         };

    //         if(progressUpdate === 0 && !prevState.held_directions[0]) {
    //             walkingUpdate = "false";
    //         }

    //         return {
    //             ...prevState,
    //             coord: coordUpdate,
    //             movingProgressRemaining: progressUpdate,
    //             facing: facingUpdate,
    //             walking: walkingUpdate
    //         };
    //     });
    // };

    const walk = () => {
        characterState.walking = "true";
        const [property, change] = directionUpdates[characterState.facing];
        characterState.coord[property] += (change * characterState.speed);
        characterState.movingProgressRemaining -= characterState.speed;
    };

    const startBehavior = (state: TcharacterState, behavior: TbehaviorObj) => {
        state.facing = behavior.direction;

        if(behavior.type === "walk") {
            if(!isSpaceTaken(
                state.coord.x,
                state.coord.y,
                state.facing,
                {
                    ...gameState.walls,
                    ...gameState.hitboxes
                }
            )) {
                moveCollision(characterState.coord.x, characterState.coord.y, characterState.facing, gameState.hitboxes);
                state.movingProgressRemaining = gridCell(1);
            };
        };
    };

	const updatePosition = () => {
        // walk();
        if(characterState.movingProgressRemaining > 0) {
            walk();
        };

        if(characterState.movingProgressRemaining === 0 && characterState.held_directions[0]) {
            startBehavior(characterState, {
                type: "walk",
                direction: characterState.held_directions[0]
            });
        };

        if(characterState.movingProgressRemaining === 0 && !characterState.held_directions[0]) {
            characterState.walking = "false";
        };
	};

	useEffect(() => {
		updatePosition();
	}, [props.step]);

    useEffect(() => {
        addCollision(characterState.coord.x, characterState.coord.y, gameState.hitboxes);
    }, [])

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