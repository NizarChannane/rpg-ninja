import { useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import utils from "../../utils/utilsIndex";
import type { TbehaviorObj } from "../../utils/characterBehaviors";
import styles from "./Character.module.css";
import characterWalkSpritesheet from "../../assets/Walk.png";
import characterShadow from "../../assets/Shadow.png";



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



export default function Character(props: TCharacterProps) {
    const { gameState } = useGameContext();
    const characterState = props.isPlayer ? (useGameContext()).gameState.player : (useGameContext()).gameState.npcs[props.index];



    const updatePosition = () => {
        characterState.walking = "true";
        const [property, change] = utils.inputs.directionUpdates[characterState.facing];
        characterState.coord[property] += (change * characterState.speed);
        characterState.movingProgressRemaining -= characterState.speed;

		if(characterState.movingProgressRemaining === 0) {
			utils.gameEvents.emitCustomEvent("MovingProgressComplete", characterState)
		};
    };



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