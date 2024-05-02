import type { TcharacterState } from "../components/Characters/Character";

export const emitCustomEvent = (name: string, detail: TcharacterState) => {
    const event = new CustomEvent(name, {
        detail
    });

    document.dispatchEvent(event);
};

export const addCustomEventListener = (name: string, state: TcharacterState, resolve: (value: unknown) => void) => {
    const completeHandler = (e: CustomEvent) => {
        if(e.detail.id === state.id) {
            document.removeEventListener(name, completeHandler as (e: Event) => void);
            resolve(null);
        };
    };

    document.addEventListener(name, completeHandler as (e: Event) => void);
};