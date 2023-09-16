import styles from "./Icon.module.scss"
const Icon = ({ children }) => {
	return <div className={styles.icon}>{children}</div>;
};

export default Icon;
