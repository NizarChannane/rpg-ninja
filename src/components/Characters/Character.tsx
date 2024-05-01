import { useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { isSpaceTaken, addCollision, moveCollision } from "../../utils/collisions";
import { gridCell } from "../../utils/grid";
import styles from "./Character.module.css";
import characterWalkSpritesheet from "../../assets/Walk.png";
import characterShadow from "../../assets/Shadow.png";

type TdirectionUpdates = {
	[x: string]: [string, number];
};

type TwalkBehavior = {
    type: "walk",
    direction: string,
	retry?: boolean
};

type TstandBehavior = {
	type: "stand",
    direction: string,
	time: number
};

type TbehaviorObj = TwalkBehavior | TstandBehavior;

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

export default function Character(props: TCharacterProps) {
    const { gameState } = useGameContext();
    const characterState = props.isPlayer ? 
                            (useGameContext()).gameState.player : 
                            (useGameContext()).gameState.npcs[props.index];



    const updatePosition = () => {
        characterState.walking = "true";
        const [property, change] = directionUpdates[characterState.facing];
        characterState.coord[property] += (change * characterState.speed);
        characterState.movingProgressRemaining -= characterState.speed;

		if(characterState.movingProgressRemaining === 0) {
			const event = new CustomEvent("MovingProgressComplete", {
				detail: characterState
			});
			document.dispatchEvent(event);
		};
    };



    const startBehavior = (state: TcharacterState, behavior: TbehaviorObj) => {
        state.facing = behavior.direction;

        if(behavior.type === "walk") {
            if(isSpaceTaken(
                state.coord.x,
                state.coord.y,
                state.facing,
                {
                    ...gameState.walls,
                    ...gameState.hitboxes
                }
            )) {
				behavior.retry && setTimeout(() => {
					startBehavior(state, behavior);
				}, 10);

				return;
			};
			moveCollision(characterState.coord.x, characterState.coord.y, characterState.facing, gameState.hitboxes);
			state.movingProgressRemaining = gridCell(1);
        };

		if(behavior.type === "stand") {
			setTimeout(() => {
				const event = new CustomEvent("StandComplete", {
					detail: state
				});
				document.dispatchEvent(event);
			}, behavior.time);
		};
    };



	const behaviorFunctions: { [key: string]: (state: TcharacterState, behavior: TbehaviorObj, resolve: (value: unknown) => void) => void } = {

		walk: (state, behavior, resolve) => {
			state.walking = "true";
			startBehavior(state, {
				type: "walk",
				direction: behavior.direction,
				retry: true
			});

			const progressCompleteHandler = (e: CustomEvent) => {
				if(e.detail.id === state.id) {
					document.removeEventListener("MovingProgressComplete", progressCompleteHandler as (e: Event) => void);
					resolve(null);
				};
			};

			document.addEventListener("MovingProgressComplete", progressCompleteHandler as (e: Event) => void);
		},

		stand: (state, behavior, resolve) => {
			if(behavior.type === "stand") {
				startBehavior(state, {
					type: "stand",
					direction: behavior.direction,
					time: behavior.time
				});
			};

			const standCompleteHandler = (e: CustomEvent) => {
				if(e.detail.id === state.id) {
					document.removeEventListener("StandComplete", standCompleteHandler as (e: Event) => void);
					resolve(null);
				};
			};

			document.addEventListener("StandComplete", standCompleteHandler as (e: Event) => void);
		}
	};



	const npcBehaviors = (state: TcharacterState, behavior: TbehaviorObj) => {
		return new Promise((resolve) => {
			behaviorFunctions[behavior.type](state, behavior, resolve);
		});
	};



	const executeBehaviorLoops = async (state: TcharacterState) => {
		let behavior;
		if(state.behaviorLoop && state.behaviorLoop[0] && typeof state.behaviorIndex === "number") {
			behavior = state.behaviorLoop[state.behaviorIndex];
			await npcBehaviors(state, behavior);

			state.behaviorIndex += 1;
			if(state.behaviorIndex === state.behaviorLoop.length) {
				state.behaviorIndex = 0;
			};

			executeBehaviorLoops(state);
		};
	};



	const update = () => {
        if(characterState.movingProgressRemaining > 0) {
            updatePosition();
        };

        if(characterState.movingProgressRemaining === 0 && characterState.held_directions[0]) {
            startBehavior(characterState, {
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
				executeBehaviorLoops(characterState);
			}, 500);
		};
        addCollision(characterState.coord.x, characterState.coord.y, gameState.hitboxes);
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