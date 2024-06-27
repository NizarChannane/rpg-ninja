import type { TcharacterState } from "../components/Characters/Character";
import { gridCell } from "./grid";
import { isSpaceTaken } from "./collisions";
import { emitCustomEvent, addCustomEventListener } from "./gameEvents";
import { moveCollision } from "./collisions";
import { TGameState } from "../contexts/gameContext";

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

export type TbehaviorObj = TwalkBehavior | TstandBehavior;

export const startBehavior = (gameState: TGameState, state: TcharacterState, behavior: TbehaviorObj) => {
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
                startBehavior(gameState, state, behavior);
            }, 10);

            return;
        };
        moveCollision(state.coord.x, state.coord.y, state.facing, gameState.hitboxes);
        state.movingProgressRemaining = gridCell(1);
    };

    if(behavior.type === "stand") {
        setTimeout(() => {
            emitCustomEvent("StandComplete", state);
        }, behavior.time);
    };
};

const behaviorFunctions: { 
    [key: string]: (
        gameState: TGameState, 
        state: TcharacterState, 
        behavior: TbehaviorObj, 
        resolve: (value: unknown) => void
    ) => void 
} = {

    walk: (gameState, state, behavior, resolve) => {
        state.walking = "true";
        startBehavior(gameState, state, {
            type: "walk",
            direction: behavior.direction,
            retry: true
        });

        addCustomEventListener("MovingProgressComplete", state, resolve);
    },

    stand: (gameState, state, behavior, resolve) => {
        if(behavior.type === "stand") {
            startBehavior(gameState, state, {
                type: "stand",
                direction: behavior.direction,
                time: behavior.time
            });
        };

        addCustomEventListener("StandComplete", state, resolve);
    }
};

const npcBehaviors = (gameState: TGameState, state: TcharacterState, behavior: TbehaviorObj) => {
    return new Promise((resolve) => {
        behaviorFunctions[behavior.type](gameState, state, behavior, resolve);
    });
};

export const executeBehaviorLoops = async (gameState: TGameState, state: TcharacterState) => {
    let behavior;
    if(state.behaviorLoop && state.behaviorLoop[0] && typeof state.behaviorIndex === "number") {
        behavior = state.behaviorLoop[state.behaviorIndex];
        await npcBehaviors(gameState, state, behavior);

        state.behaviorIndex += 1;
        if(state.behaviorIndex === state.behaviorLoop.length) {
            state.behaviorIndex = 0;
        };

        executeBehaviorLoops(gameState, state);
    };
};