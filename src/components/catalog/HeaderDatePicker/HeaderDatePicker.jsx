import styles from './HeaderDatePicker.module.scss';
import { useSelector } from 'react-redux';
const months = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
];

const months_en = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const HeaderDatePicker = ({
	date,
	changeYear,
	changeMonth,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled,
}) => {
	const language = useSelector((state) => state.app.language);
	return (
		<div className={styles.container}>
			<span>
				{language === 'ru' ? months[date.getMonth()] : months_en[date.getMonth()]}{' '}
				{date.getFullYear()}
			</span>
			<div className={styles.btns}>
				<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
					<svg
						width="16"
						height="17"
						viewBox="0 0 16 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M10 14L5 9L10 4"
							stroke="black"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>

				<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
					<svg
						width="16"
						height="17"
						viewBox="0 0 16 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6 14L11 9L6 4"
							stroke="black"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default HeaderDatePicker;
