import { useEffect, useState, useRef, Fragment, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import {
	setColor,
	setName,
	setDateAt,
	setDateTo,
	setRelease,
	setHelmet,
	setAbs,
	setKeyless,
	setSelectedBike,
} from './../../redux/appState/Dataset';
import s from './Catalog.module.scss';
import './DatePicker.css';

import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import HeaderDatePicker from './HeaderDatePicker/HeaderDatePicker';

import ru from 'date-fns/locale/ru';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import SwiperBlock from './../swiperBlock/SwiperBlock';
import DialogueWindow from '../dialogueWindow/DialogueWindow';
import { UserContext } from '../../context/user';
import { post } from '../../lib/api';

registerLocale('ru', ru);

function addLeadingZero(num) {
	return num < 10 ? '0' + num : num;
}

export const Catalog = () => {
	const language = useSelector((state) => state.app.language);
	const dataset = useSelector((state) => state.dataset);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [question, setQuestion] = useState(false);
	const [sendLocationWin, setSendLocationWin] = useState(false);
	const [num, setNum] = useState(0);
	const [calendarView1, setCalendarView1] = useState(false);
	const [date_at, setDate_at] = useState(null);
	const [triangleX, setTriangleX] = useState(0);
	const [formState, setFormState] = useState({ date_at: false, date_to: true });
	const selected_bike = useSelector((state) => state.dataset.selected_bike);
	const user = useContext(UserContext);

	const btnRef = useRef();

	const headRef = useRef(null);
	const questionRef = useRef(null);
	const parentQuestionRef = useRef(null);
	const calendarRef = useRef(null);
	const firstRender = useRef(false);

	dispatch(setDateAt(date_at));

	const [calendarView2, setCalendarView2] = useState(false);
	const [date_to, setDate_to] = useState(null);

	dispatch(setDateTo(date_to));

	var current_dataset = {};
	var cd = null;

	if (dataset.selected_bike.type == 'mini') {
		current_dataset = dataset.mini.items;
		cd = dataset.mini;
	} else if (dataset.selected_bike.type == 'highways') {
		current_dataset = dataset.highways.items;
		cd = dataset.highways;
	} else if (dataset.selected_bike.type == 'luxe') {
		current_dataset = dataset.luxe.items;
		cd = dataset.luxe;
	}

	function setLocale() {
		const loctext = {};
		if (language == 'ru') {
			switch (dataset.selected_bike.type) {
				case 'mini':
					loctext.head_title = 'Мини скутеры';
					break;
				case 'highways':
					loctext.head_title = 'Шоссейные';
					break;
				case 'luxe':
					loctext.head_title = 'Премиум';
					break;
			}
			loctext.subtitle = 'Изображение рекламного объекта может отличаться от реального';
			loctext.period = 'Срок аренды';
			loctext.date_at = 'Дата начала аренды';
			loctext.date_to = 'Завершение аренды';
			loctext.date = 'дд.мм.гг';
			loctext.release = 'Год выпуска';
			loctext.from = 'от';
			loctext.color = 'Цвет';
			loctext.white = 'Белый';
			loctext.red = 'Красный';
			loctext.blue = 'Синий';
			loctext.black = 'Черный';
			loctext.yellow = 'Желтый';
			loctext.bright = 'Яркий';
			loctext.count_helmet = 'Количество шлемов';
			loctext.one_helmet = 'Один шлем';
			loctext.two_helmet = 'Два шлема';
			loctext.no_helmet = 'Не нужно';
			loctext.additional_options = 'Доп.опции';
			loctext.keyless_access = 'Бесключевой доступ';
			loctext.send_location = 'Найти байк';
		} else if (language == 'en') {
			switch (dataset.selected_bike.type) {
				case 'mini':
					loctext.head_title = 'Mini scooters';
					break;
				case 'highways':
					loctext.head_title = 'Highways';
					break;
				case 'luxe':
					loctext.head_title = 'Premium';
					break;
			}
			loctext.subtitle = 'The image of the advertising object may differ from the real one';
			loctext.period = 'Rental period';
			loctext.date_at = 'Rental start date';
			loctext.date_to = 'Completion of the lease';
			loctext.date = 'dd.mm.yy';
			loctext.release = 'Year of release';
			loctext.from = 'from';
			loctext.color = 'Color';
			loctext.white = 'White';
			loctext.red = 'Red';
			loctext.blue = 'Blue';
			loctext.black = 'Black';
			loctext.yellow = 'Yellow';
			loctext.bright = 'Bright';
			loctext.count_helmet = 'Number of helmets';
			loctext.one_helmet = 'One helmet';
			loctext.two_helmet = 'Two helmets';
			loctext.no_helmet = 'No need';
			loctext.additional_options = 'Additional options';
			loctext.keyless_access = 'Keyless access';
			loctext.send_location = 'Find bike';
		}
		return loctext;
	}

	const text = setLocale();

	dispatch(setName(current_dataset[num].name));

	useEffect(() => {
		function funcScr() {
			setQuestion(false);
		}
		function funcClick() {
			setCalendarView1(false);
			setCalendarView2(false);
			setSendLocationWin(false);
		}
		window.addEventListener('scroll', funcScr);
		window.addEventListener('click', funcClick);
		return () => {
			window.removeEventListener('scroll', funcScr);
			window.removeEventListener('click', funcClick);
		};
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);

		headRef.current.style.opacity = 1;
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			setFormState({ ...formState, date_at: date_at !== null, date_to: date_to !== null });
			if (sendLocationWin) {
				setSendLocationWin(!(date_at !== null && date_to !== null));
			}
		}

		firstRender.current = true;
	}, [date_to, date_at]);

	function sendLocationClick() {
		if (date_at && date_to) {
			const token = user?.token;
			// if(!token) {
			// 	alert('Вы не авторизованы')
			// 	return navigate('/')
			// }
			post(
				'/requests/create',
				{ token },
				{
					model_id: selected_bike.model_id,
					additional_params:
						selected_bike.options.abs === true ||
						selected_bike.options.keyless_access === true ||
						(selected_bike.release != '' && selected_bike.release != null),
					rent_start_date: moment(selected_bike.date_at).format('YYYY-MM-DD 00:00:00'),
					rent_end_date: moment(selected_bike.date_to).format('YYYY-MM-DD 23:59:59'),
					year_from:
						selected_bike.release != null && selected_bike.release != ''
							? parseInt(selected_bike.release)
							: 0,
					helmets:
						selected_bike.helmet_count === null || selected_bike.helmet_count === ''
							? 'any'
							: selected_bike.helmet_count,
					address: '',
					lat: 0,
					lon: 0,
					color: 'any',
					abs: selected_bike.options.abs === true ? 'yes' : 'any',
					keyless: selected_bike.options.keyless_access === true ? 'yes' : 'any',
				},
			)
				.then((data) => {
					navigate('/wait');
				})
				.catch((error) => {
					alert('Ошибка при оформлении заявки');
					navigate('/wait');
				});
		} else {
			setFormState({ ...formState, date_at: date_at !== null, date_to: date_to !== null });
			setSendLocationWin(true);
			calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	return (
		<div style={{ opacity: 0, transition: '1.2s' }} ref={headRef}>
			<div className={s.head_title} onClick={() => navigate('/main')}>
				<div className={s.header_absolute}>
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
					<span>{text.head_title}</span>
				</div>
			</div>

			<div ref={parentQuestionRef} className={s.wrapper} onClick={() => setQuestion(false)}>
				<div style={{ padding: '12px 16px' }} className={s.wrapper_inner}>
					<SwiperBlock
						defaultIndex={dataset[dataset.selected_bike.type].activeIndex}
						bikes={current_dataset}
						activeIndex={dataset[dataset.selected_bike.type].activeIndex}
					/>

					<div className={s.image_attention}>
						<span>*</span>
						<span>{text.subtitle}</span>
					</div>
				</div>
				<div ref={calendarRef}></div>

				<div
					style={!formState.date_at || !formState.date_to ? { padding: '12px 0 0 0' } : undefined}
					className={s.wrapper_inner}>
					<div className={s.container}>
						<div className={s.title_with_question}>
							<span>{text.period}</span>
							<svg
								ref={questionRef}
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 22 22"
								fill="none"
								onClick={(e) => {
									e.stopPropagation();
									setQuestion(!question);
									const parentRect = parentQuestionRef?.current?.getBoundingClientRect();
									const componentRect = questionRef?.current?.getBoundingClientRect();
									setTriangleX(componentRect.left - parentRect.left);
								}}>
								<path
									d="M11 3C6.584 3 3 6.584 3 11C3 15.416 6.584 19 11 19C15.416 19 19 15.416 19 11C19 6.584 15.416 3 11 3ZM11.8 16.6H10.2V15H11.8V16.6ZM13.456 10.4L12.736 11.136C12.16 11.72 11.8 12.2 11.8 13.4H10.2V13C10.2 12.12 10.56 11.32 11.136 10.736L12.128 9.728C12.424 9.44 12.6 9.04 12.6 8.6C12.6 7.72 11.88 7 11 7C10.12 7 9.4 7.72 9.4 8.6H7.8C7.8 6.832 9.232 5.4 11 5.4C12.768 5.4 14.2 6.832 14.2 8.6C14.2 9.304 13.912 9.944 13.456 10.4Z"
									fill="#B7B7B7"
									fill-opacity="0.7"
								/>
							</svg>
						</div>

						<div className={s.calendar}>
							<div
								onClick={(event) => {
									event?.stopPropagation();
								}}
								className={s.half}>
								<div
									className={s.calendar_item}
									onClick={() => {
										setCalendarView1(!calendarView1);
										setCalendarView2(false);
										if (!calendarView2 && !calendarView1)
											calendarRef.current.scrollIntoView({
												behavior: 'smooth',
												block: 'start',
												top: true,
											});
									}}>
									<div
										style={{
											color: !formState.date_at ? '#FF4848' : undefined,
										}}
										className={s.c_title}>
										{text.date_at}
									</div>
									<div
										style={{
											border: !formState.date_at ? '1px solid #FF4848' : undefined,
										}}
										className={calendarView1 ? s.input_active : s.input}>
										<span className={date_at ? s.active_text : ''}>
											{date_at
												? `${addLeadingZero(date_at.getDate())}.${addLeadingZero(
														date_at.getMonth() + 1,
												  )}.${date_at.getFullYear()}`
												: text.date}
										</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 22 22"
											fill="none">
											<path
												d="M17.4167 3.6665H4.58333C3.57081 3.6665 2.75 4.48732 2.75 5.49984V18.3332C2.75 19.3457 3.57081 20.1665 4.58333 20.1665H17.4167C18.4292 20.1665 19.25 19.3457 19.25 18.3332V5.49984C19.25 4.48732 18.4292 3.6665 17.4167 3.6665Z"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M14.6666 1.8335V5.50016"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M7.33337 1.8335V5.50016"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M2.75 9.1665H19.25"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									{!formState.date_at && formState.date_to && (
										<div className={s.dateError}>
											{language === 'ru' ? 'Укажите дату начала' : 'Specify a start date'}
										</div>
									)}
								</div>

								<div
									className={s.calendar_item}
									onClick={() => {
										setCalendarView2(!calendarView2);
										setCalendarView1(false);
										if (!calendarView2 && !calendarView1)
											calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}}>
									<div
										style={{
											color: !formState.date_to ? '#FF4848' : undefined,
										}}
										className={s.c_title}>
										{text.date_to}
									</div>
									<div
										style={{
											border: !formState.date_to ? '1px solid #FF4848' : undefined,
										}}
										className={calendarView2 ? s.input_active : s.input}>
										<span className={date_to ? s.active_text : ''}>
											{date_to
												? `${addLeadingZero(date_to.getDate())}.${addLeadingZero(
														date_to.getMonth() + 1,
												  )}.${date_to.getFullYear()}`
												: text.date}
										</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="22"
											height="22"
											viewBox="0 0 22 22"
											fill="none">
											<path
												d="M17.4167 3.6665H4.58333C3.57081 3.6665 2.75 4.48732 2.75 5.49984V18.3332C2.75 19.3457 3.57081 20.1665 4.58333 20.1665H17.4167C18.4292 20.1665 19.25 19.3457 19.25 18.3332V5.49984C19.25 4.48732 18.4292 3.6665 17.4167 3.6665Z"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M14.6666 1.8335V5.50016"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M7.33337 1.8335V5.50016"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M2.75 9.1665H19.25"
												stroke="#202020"
												stroke-width="1.2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									{!formState.date_to && formState.date_at && (
										<div className={s.dateError}>
											{' '}
											{language === 'ru' ? 'Укажите дату завершения' : 'Specify an end date'}
										</div>
									)}
								</div>

								{calendarView1 && (
									<div className={s.calendar_wrapper}>
										<ReactDatePicker
											selected={date_at}
											onChange={(date) => {
												setDate_at(date);
												if (!date_to) {
													setCalendarView2(true);
												}
												setCalendarView1(false);
											}}
											calendarStartDay={1}
											locale={language === 'ru' && ru}
											renderCustomHeader={({
												date,
												changeYear,
												changeMonth,
												decreaseMonth,
												increaseMonth,
												prevMonthButtonDisabled,
												nextMonthButtonDisabled,
											}) => (
												<HeaderDatePicker
													calendarStartDay={1}
													date={date}
													changeYear={changeYear}
													changeMonth={changeMonth}
													decreaseMonth={decreaseMonth}
													increaseMonth={increaseMonth}
													prevMonthButtonDisabled={prevMonthButtonDisabled}
													nextMonthButtonDisabled={nextMonthButtonDisabled}
												/>
											)}
											inline
											minDate={new Date()}
											maxDate={date_to ? date_to : null}
										/>
									</div>
								)}

								{calendarView2 && (
									<div
										style={{ right: calendarView2 ? '0px' : 'auto' }}
										className={s.calendar_wrapper}>
										<ReactDatePicker
											selected={date_to}
											onChange={(date) => {
												setDate_to(date);
												if (!date_at) {
													setCalendarView1(true);
												}
												setCalendarView2(false);
											}}
											locale={language === 'ru' && ru}
											calendarStartDay={1}
											renderCustomHeader={({
												date,
												changeYear,
												changeMonth,
												decreaseMonth,
												increaseMonth,
												prevMonthButtonDisabled,
												nextMonthButtonDisabled,
											}) => (
												<HeaderDatePicker
													calendarStartDay={1}
													date={date}
													changeYear={changeYear}
													changeMonth={changeMonth}
													decreaseMonth={decreaseMonth}
													increaseMonth={increaseMonth}
													prevMonthButtonDisabled={prevMonthButtonDisabled}
													nextMonthButtonDisabled={nextMonthButtonDisabled}
												/>
											)}
											inline
											minDate={date_at ? date_at : new Date()}
										/>
									</div>
								)}
							</div>

							{!formState.date_to && !formState.date_at && (
								<div className={s.dateError}>
									{' '}
									{language === 'ru'
										? 'Укажите дату начала и завершения аренды'
										: 'Specify the start and end date of the lease'}
								</div>
							)}
						</div>
					</div>

					{question && (
						<DialogueWindow active={question} style={{ top: 50 }} triangleX={triangleX - 15}>
							<>
								<span>{language === 'ru' ? 'Обратите внимание!' : 'Pay attention!'} </span>{' '}
								{language === 'ru'
									? 'Чем дольше срок, тем ниже цена. Если вы планируете арендовать байк на длительный срок, но не определились с точными датами, рекомендуем указать срок аренды на один месяц'
									: 'The longer the term, the lower the price. If you plan to rent a bike for a long time, but have not decided on the exact dates, we recommend that you specify a rental period of one month'}
							</>
						</DialogueWindow>
					)}
				</div>

				<div className={s.wrapper_inner}>
					<div className={s.container}>
						{' '}
						<div className={s.title}>
							<span>{text.release}</span>
						</div>
						<div className={s.items_flex_start}>
							<div
								className={`${dataset.selected_bike.release === '2023' ? s.active : ''} ${
									language === 'en' && s.eng
								}`}
								onClick={() => {
									if (dataset.selected_bike.release === '2023') dispatch(setRelease(''));
									else dispatch(setRelease('2023'));
								}}>
								2023
							</div>
							<div
								className={`${dataset.selected_bike.release === '2022' ? s.active : ''} ${
									language === 'en' && s.eng
								}`}
								onClick={() => {
									if (dataset.selected_bike.release === '2022') dispatch(setRelease(''));
									else dispatch(setRelease('2022'));
								}}>
								{text.from} 2022
							</div>
							<div
								className={`${dataset.selected_bike.release === '2020' ? s.active : ''} ${
									language === 'en' && s.eng
								}`}
								onClick={() => {
									if (dataset.selected_bike.release === '2020') dispatch(setRelease(''));
									else dispatch(setRelease('2020'));
								}}>
								{text.from} 2020
							</div>
							<div
								className={`${dataset.selected_bike.release === '2018' ? s.active : ''} ${
									language === 'en' && s.eng
								}`}
								onClick={() => {
									if (dataset.selected_bike.release === '2018') dispatch(setRelease(''));
									else dispatch(setRelease('2018'));
								}}>
								{text.from} 2018
							</div>
						</div>
					</div>
				</div>

				<div className={s.wrapper_inner}>
					<div className={s.container}>
						<div className={s.title}>
							<span>{text.additional_options}</span>
						</div>

						<div className={s.items_flex_start}>
							<div
								className={dataset.selected_bike.options.abs ? s.active : ''}
								onClick={() => dispatch(setAbs(!dataset.selected_bike.options.abs))}>
								ABS
							</div>
							<div
								className={dataset.selected_bike.options.keyless_access ? s.active : ''}
								onClick={() => dispatch(setKeyless(!dataset.selected_bike.options.keyless_access))}>
								{text.keyless_access}
							</div>
						</div>
					</div>
				</div>
				<div className={s.wrapper_inner}>
					<div className={s.container}>
						{' '}
						<div className={s.title}>
							<span>{text.count_helmet}</span>
						</div>
						<div className={s.items_flex_start}>
							<div
								className={dataset.selected_bike.helmet_count === 'one' ? s.active : ''}
								onClick={() => {
									if (dataset.selected_bike.helmet_count === 'one') dispatch(setHelmet(''));
									else dispatch(setHelmet('one'));
								}}>
								{text.one_helmet}
							</div>
							<div
								className={dataset.selected_bike.helmet_count === 'two' ? s.active : ''}
								onClick={() => {
									if (dataset.selected_bike.helmet_count === 'two') dispatch(setHelmet(''));
									else dispatch(setHelmet('two'));
								}}>
								{text.two_helmet}
							</div>
							<div
								className={dataset.selected_bike.helmet_count === 'no_helmet' ? s.active : ''}
								onClick={() => {
									if (dataset.selected_bike.helmet_count === 'no_helmet') dispatch(setHelmet('0'));
									else dispatch(setHelmet('no_helmet'));
								}}>
								{text.no_helmet}
							</div>
						</div>
					</div>
				</div>
			</div>

			{sendLocationWin && (
				<div
					style={{
						width: '100%',
						maxWidth: 500,
						padding: '0 16px',
						position: 'fixed',
						bottom: 81,
						zIndex: 1001,
						left: '50%',
						transform: 'translate(-50%)',
					}}>
					<DialogueWindow style={{ position: 'relative' }} orientation="bottom">
						<>
							<span>
								{language === 'ru' ? 'Укажите дату начала и завершения аренды.' : 'Pay attention!'}{' '}
							</span>{' '}
							{language === 'ru'
								? 'После этого вы сможете отправить локацию'
								: 'The longer the term, the lower the price. If you plan to rent a bike for a long time, but have not decided on the exact dates, we recommend that you specify a rental period of one month'}
						</>
					</DialogueWindow>
				</div>
			)}

			<div className={s.footer}>
				<button
					className={s.footer_inner}
					onClick={(event) => {
						btnRef?.current.classList.toggle(s.click);

						event.stopPropagation();
						dispatch(
							setSelectedBike({
								...dataset.selected_bike,
								model_id: cd ? cd.items[cd.activeIndex].id : 0,
							}),
						);
						sendLocationClick();
						setTimeout(() => {
							btnRef?.current?.classList?.toggle(s.click);
						}, 1000);
					}}>
					<div ref={btnRef} className={date_at && date_to ? '' : s.disactive}>
						{text.send_location}
					</div>
				</button>
			</div>
		</div>
	);
};
