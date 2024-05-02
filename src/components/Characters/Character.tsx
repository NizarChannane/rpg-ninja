import { useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
// import { isSpaceTaken, addCollision, moveCollision } from "../../utils/collisions";
// import { gridCell } from "../../utils/grid";
// import { emitCustomEvent, addCustomEventListener } from "../../utils/gameEvents";
import utils from "../../utils/utilsIndex";
import type { TbehaviorObj } from "../../utils/characterBehaviors";
import styles from "./Character.module.css";
import characterWalkSpritesheet from "../../assets/Walk.png";
import characterShadow from "../../assets/Shadow.png";

// type TdirectionUpdates = {
// 	[x: string]: [string, number];
// };

// type TwalkBehavior = {
//     type: "walk",
//     direction: string,
// 	retry?: boolean
// };

// type TstandBehavior = {
// 	type: "stand",
//     direction: string,
// 	time: number
// };

// type TbehaviorObj = TwalkBehavior | TstandBehavior;

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
	behaviorLoop?: TbehaviorObj[] | [],
	behaviorIndex?: number
	characterWidth: number,
	characterHeight: number
};

export type TCharacterProps = {
    step: number
} & ({
    isPlayer: true,
} | {
    isPlayer: false,
    index: number
});

// const directions = {
// 	up: "up",
// 	down: "down",
// 	left: "left",
// 	right: "right",
// };

// const directionUpdates: TdirectionUpdates = {
// 	[directions.up]: ["y", -1],
// 	[directions.down]: ["y", 1],
// 	[directions.left]: ["x", -1],
// 	[directions.right]: ["x", 1]
// };

export default function Character(props: TCharacterProps) {
    const { gameState } = useGameContext();
    const characterState = props.isPlayer ? 
                            (useGameContext()).gameState.player : 
                            (useGameContext()).gameState.npcs[props.index];



    const updatePosition = () => {
        characterState.walking = "true";
        const [property, change] = utils.inputs.directionUpdates[characterState.facing];
        characterState.coord[property] += (change * characterState.speed);
        characterState.movingProgressRemaining -= characterState.speed;

		if(characterState.movingProgressRemaining === 0) {
			utils.gameEvents.emitCustomEvent("MovingProgressComplete", characterState)
		};
    };



    // const startBehavior = (state: TcharacterState, behavior: TbehaviorObj) => {
    //     state.facing = behavior.direction;

    //     if(behavior.type === "walk") {
    //         if(isSpaceTaken(
    //             state.coord.x,
    //             state.coord.y,
    //             state.facing,
    //             {
    //                 ...gameState.walls,
    //                 ...gameState.hitboxes
    //             }
    //         )) {
	// 			behavior.retry && setTimeout(() => {
	// 				startBehavior(state, behavior);
	// 			}, 10);

	// 			return;
	// 		};
	// 		moveCollision(state.coord.x, state.coord.y, state.facing, gameState.hitboxes);
	// 		state.movingProgressRemaining = gridCell(1);
    //     };

	// 	if(behavior.type === "stand") {
	// 		setTimeout(() => {
	// 			emitCustomEvent("StandComplete", state);
	// 		}, behavior.time);
	// 	};
    // };



	// const behaviorFunctions: { [key: string]: (state: TcharacterState, behavior: TbehaviorObj, resolve: (value: unknown) => void) => void } = {

	// 	walk: (state, behavior, resolve) => {
	// 		state.walking = "true";
	// 		startBehavior(state, {
	// 			type: "walk",
	// 			direction: behavior.direction,
	// 			retry: true
	// 		});

	// 		addCustomEventListener("MovingProgressComplete", state, resolve);
	// 	},

	// 	stand: (state, behavior, resolve) => {
	// 		if(behavior.type === "stand") {
	// 			startBehavior(state, {
	// 				type: "stand",
	// 				direction: behavior.direction,
	// 				time: behavior.time
	// 			});
	// 		};

	// 		addCustomEventListener("StandComplete", state, resolve);
	// 	}
	// };



	// const npcBehaviors = (state: TcharacterState, behavior: TbehaviorObj) => {
	// 	return new Promise((resolve) => {
	// 		behaviorFunctions[behavior.type](state, behavior, resolve);
	// 	});
	// };



	// const executeBehaviorLoops = async (state: TcharacterState) => {
	// 	let behavior;
	// 	if(state.behaviorLoop && state.behaviorLoop[0] && typeof state.behaviorIndex === "number") {
	// 		behavior = state.behaviorLoop[state.behaviorIndex];
	// 		await npcBehaviors(state, behavior);

	// 		state.behaviorIndex += 1;
	// 		if(state.behaviorIndex === state.behaviorLoop.length) {
	// 			state.behaviorIndex = 0;
	// 		};

	// 		executeBehaviorLoops(state);
	// 	};
	// };



	const update = () => {
        if(characterState.movingProgressRemaining > 0) {
            updatePosition();
        };

        if(characterState.movingProgressRemaining === 0 && characterState.held_directions[0]) {
            utils.characterBehaviors.startBehavior(gameState, characterState, {
                type: "walk",
                direction: characterState.held_directions[0],
				retry: false
            });
        };

        if(characterState.movingProgressRemaining === 0 && !characterState.held_directions[0]) {
            characterState.walking = "false";
        };
	};



	useEffect(() => {
		update();
	}, [props.step]);



    useEffect(() => {
		if(!props.isPlayer) {
			setTimeout(() => {
				utils.characterBehaviors.executeBehaviorLoops(gameState, characterState);
			}, 500);
		};
        utils.collisions.addCollision(characterState.coord.x, characterState.coord.y, gameState.hitboxes);
    }, []);



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
	);
};