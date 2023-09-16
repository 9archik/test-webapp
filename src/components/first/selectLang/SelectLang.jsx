import styles from './SelectLang.module.scss';
import russia_flag from '../../../static/images/flag-for-russia.png';
import united_kingdom from '../../../static/images/flag-for-united-kingdom.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setLanguage, setSelected } from '../../../redux/appState/AppSlice';
import { useEffect, useLayoutEffect, useState } from 'react';
const SelectLang = ({ active }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [mount, setMount] = useState(false);

	useEffect(() => {
		if (active) {
			setMount(true);
		}
	}, [active]);

	return (
		<div className={`${styles.container} ${mount && styles.active}`}>
			<div className={styles.ruheader}>Select language</div>
			<div className={styles.buttons}>
				<button
					onClick={() => {
						dispatch(setLanguage('ru'));
						navigate('/main');
					}}>
					<img width={24} height={24} src={russia_flag} alt="Флаг России" />
					<span>Русский</span>{' '}
				</button>
				<button
					onClick={() => {
						dispatch(setLanguage('en'));

						navigate('/main');
					}}>
					<img width={24} height={24} src={united_kingdom} alt="Флаг Великобритании" />
					<span>English</span>
				</button>
			</div>
		</div>
	);
};

export default SelectLang;
