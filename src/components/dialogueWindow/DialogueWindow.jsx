import { useState } from 'react';
import styles from './DialogueWindow.module.scss';
const DialogueWindow = ({ children, orientation = 'top', triangleX = "50%", top = 0, style}) => {

	return (
		<>
			<div style={style} className={styles.question}>
				<div style={{ left: triangleX } } className={`${styles.triangle} ${orientation === 'bottom' && styles.bottom}`}></div>
				{children}
			</div>
		</>
	);
};

export default DialogueWindow;
