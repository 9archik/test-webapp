import { Children, useEffect, useRef } from 'react';
import styles from './Modal.module.scss';
const Modal = ({ children, active }) => {
	const ref = useRef(null);
	useEffect(() => {
		if (active) {
			ref.current.style.background = 'rgba(0, 0, 0, 0.50)';
			ref.current.style.transition = '1s';
		}
	}, [active]);
	return (
		<div ref={ref} className={`${styles.container}`}>
			{children}
		</div>
	);
};

export default Modal;
