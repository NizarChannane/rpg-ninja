import type { ReactNode } from "react";
import styles from "./Map.module.css";
import DemoMapBg from "../../assets/DemoMap_background.png";
import DemoMapFg from "../../assets/DemoMap_foreground.png";
import { useGameContext } from "../../hooks/useGameContext";

type TMapProps = {
    children: ReactNode,
    // gameState: TGameState
};

export default function Map({ children }: TMapProps) {
    const { gameState } = useGameContext();
	const camera_left = 152;
	const camera_top = 136;

    return (
        <div className={styles.scale}>
            <div 
                className={styles.map}
                style={{
                    backgroundImage: `url(${DemoMapBg})`,
                    transform: `translate3d( ${-gameState.player.coord.x+camera_left}px, ${-gameState.player.coord.y+camera_top}px, 0 )` 
                }}
            >
                <div
                    className={styles.map}
                    style={{
                        backgroundImage: `url(${DemoMapFg})`,
                        zIndex: "1"
                    }}
                />
                {children}
            </div>
            
        </div>
    );
};