import { useContext } from "react";
import { GameStateContext } from "../contexts/gameContext";

export const useGameContext = () => {
    const context = useContext(GameStateContext);

    if (!context) {
        throw Error("useGameContext must be used inside a GameContextProvider");
    };

    return context;
};