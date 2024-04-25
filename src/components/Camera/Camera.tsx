// import { useEffect } from "react";
import styles from "./Camera.module.css";

type TCameraProps = {
    children: JSX.Element
};

export default function Camera({ children }: TCameraProps) {
    // console.log(children);

    return (
        <div className={styles.camera}>
            {children}
        </div>
    )
};