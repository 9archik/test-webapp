import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import s from './Wait.module.scss';
import Icon from '../icon/Icon';

import wait_img from './../../static/images/wait.png';
import { useContext } from 'react';
import { TelegramWebAppContext } from '../../context/telegram';

export const Wait = () => {
	const telegramWebApp = useContext(TelegramWebAppContext)
	const navigate = useNavigate();
	const language = useSelector((state) => state.app.language);

	function setLocale() {
		const loctext = {};
		if (language == 'ru') {
			loctext.title = 'Заявка отправлена';
			loctext.subtitle =
				'Сервисы проката отвечают нам обычно за 3 минуты. Можете закрыть это окно, мы напишем вам в телеграм.';
			loctext.price = 'Закрыть приложение';
		} else if (language == 'en') {
			loctext.title = 'The application has been sent';
			loctext.subtitle =
				'Rental services usually respond to us in 3 minutes. You can close this window, we will write to you in telegram.';
			loctext.price = 'Close the application';
		}
		return loctext;
	}

	const text = setLocale();

	return (
		<div className={s.wrapper}>
			<div className={s.arrow}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none">
					<path
						d="M21 12H3M3 12L9.75 5M3 12L9.75 19"
						stroke="#202020"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			<div className={s.info}>
				<Icon>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="52"
						height="52"
						viewBox="0 0 52 52"
						fill="none">
						<path
							d="M26 48.75C38.5645 48.75 48.75 38.5645 48.75 26C48.75 13.4355 38.5645 3.25 26 3.25C13.4355 3.25 3.25 13.4355 3.25 26C3.25 38.5645 13.4355 48.75 26 48.75Z"
							stroke="#202020"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M26 13V26L32.5 32.5"
							stroke="#202020"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Icon>
				<div>{text.title}</div>
				<div className={s.subtitle}>{text.subtitle}</div>
			</div>

			<div className={s.footer}>
				<div className={s.button} onClick={() => telegramWebApp.close()}>{text.price}</div>
			</div>
		</div>
	);
};
