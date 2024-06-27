import styles from "./Camera.module.css";

type TCameraProps = {
    children: JSX.Element
};

export default function Camera({ children }: TCameraProps) {

    return (
        <div className={styles.camera}>
            {children}
        </div>
    )
};