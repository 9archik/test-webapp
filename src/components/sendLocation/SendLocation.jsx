import { useEffect, useState, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import config from '../../config';
import moment from 'moment';

import styles from './SendLocation.module.scss';
import { useCoordinates } from '../../hooks/misc';
import { post } from '../../lib/api';
import { UserContext } from '../../context/user';


function Marker({ title }) {
	return <div style={{ width: 16, height: 16, backgroundColor: '#fff', borderRadius: '50%', border: 'solid 2px #1111ff' }}>{title}</div>
}


const text = {
	header: {
		ru: 'Куда доставить байк?',
		en: 'Where to deliver the bike?',
	},
	location: {
		ru: 'Отправить локацию',
		en: 'Send location',
	},
	inputPlaceholder: {
		ru: 'Введите куда доставить байк',
		en: 'Enter where to deliver the bike',
	},
	nothingText: {
		ru: 'Ничего не найдено',
		en: 'Nothing found',
	},
};
const SendLocation = () => {
	const [state, setState] = useState({
		input: '',
		address: '',
		buttonActive: false,
		lat: -8.4554714,
		lon: 115.071577,
		imgHeight: 0,
		show: false
	})
	const selected_bike = useSelector(state => state.dataset.selected_bike)
	const user = useContext(UserContext);
	const imgRef = useRef();
	const language = useSelector((state) => state.app.language);
	const navigate = useNavigate();
	
	const { loading, coordinates, error } = useCoordinates(state.input, user.token)

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position => {
				setTimeout(() => {
					setState({
						...state,
						lat: position.coords.latitude,
						lon: position.coords.longitude
					})
				}, 500)
			},
			error => console.log,
			{ enableHighAccuracy: true }
		)
	}, []);
	useEffect(() => {
		setState({
			...state,
			height: imgRef?.current?.clientHeight
		})
		window.addEventListener('resize', () => {
			setState({
				...state,
				height: imgRef?.current?.clientHeight
			})
		});

		return () =>
			window.addEventListener('resize', () => {
				setState({
					...state,
					height: imgRef?.current?.clientHeight
				})
			});
	}, []);

	return (
		<div className={styles.container}>
			<div
				style={
					state.input.length > 0 && coordinates.length > 0
						? { height: state.show && coordinates.length > 0 ? '100vh' : 'auto', position: 'fixed' }
						: undefined
				}
				className={styles.header_absolute}>
				<div className={styles.name}>
					<svg
						onClick={() => navigate('/catalog')}
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
					<span>{language === 'ru' ? text.header.ru : text.header.en}</span>
				</div>

				<div className={styles.input}>
					<input
						value={state.input}
						onClick={(e) => {
							e.stopPropagation();
						}}
						onChange={(e) => {
							setState({
								...state,
								input: e.target.value,
								show: e.target.value !== ''
							})
						}}
						placeholder={language === 'ru' ? text.inputPlaceholder.ru : text.inputPlaceholder.en}
					/>
				</div>

				{ coordinates.length === 0 ? state.show && (
					<div className={styles.findNothing}>
						{language === 'ru' ? text.nothingText.ru : text.nothingText.en}
					</div> // демонстрационный момент, если пользователь введет ничего, то выведется "ничего не найдено", в противном случае выведутся улицы(если что то введенно)
				) : (
					state.show && (<ul className={styles.hint}>
						{ coordinates.map((c, i) => {
							return (
								<li
									key={i}
									onClick={() => {
										setState({
											...state,
											lat: c.geometry.location.lat,
											lon: c.geometry.location.lng,
											address: c.formatted_name,
											show: false
										})
									}}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="22"
										height="21"
										viewBox="0 0 22 21"
										fill="none">
										<path
											d="M2.15855 10.7706C1.25539 10.5015 1.26005 9.37172 1.93487 9.05089L18.9069 0.981837C19.6873 0.610843 20.5521 1.47573 20.1811 2.25606L12.1121 19.2281C11.7912 19.9029 10.6615 19.9076 10.3924 19.0044L9.0223 14.406C8.6989 13.3205 7.84246 12.4641 6.75699 12.1407L2.15855 10.7706Z"
											stroke="#B7B7B7"
											stroke-width="1.5"
										/>
									</svg>
									<span>{ c.formatted_address }</span>
								</li>
							)
						}) }
					</ul>)
				)}
			</div>

			<div ref={imgRef} className={styles.map}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: config.GOOGLE_MAPS_API_KEY }}
					center={{ lat: state.lat, lng: state.lon }}
					zoom={12}
					onClick={e => setState({...state, lat: e.lat, lon: e.lng, input: '', show: false})}>
					<Marker lat={state.lat} lng={state.lon} title={state.address} />
				</GoogleMapReact>
			</div>

			<div className={styles.footer}>
				<button
					className={styles.footer_inner}
					onClick={(event) => {
						event.stopPropagation();
						const token = user.token
						if(!token) {
							alert('Вы не авторизованы')
							navigate('/')
						}
						post('/requests/create', { token }, {
							model_id: selected_bike.model_id,
							additional_params: true,
							rent_start_date: moment(selected_bike.date_at).format('YYYY-MM-DD 00:00:00'),
							rent_end_date: moment(selected_bike.date_to).format('YYYY-MM-DD 23:59:59'),
							year_from: selected_bike.release != null && selected_bike.release != '' ? parseInt(selected_bike.release) : 0,
							helmets: selected_bike.helmet_count === null || selected_bike.helmet_count === '' ? 'any' : state.helmet_count,
							address: state.address,
							lat: state.lat,
							lon: state.lon,
							color: selected_bike.color === '' ? 'any' : selected_bike.color,
							abs: selected_bike.options.abs === true ? 'yes' : selected_bike.options.abs === null || selected_bike.options.abs === '' ? 'any' : 'no',
							keyless: selected_bike.options.keyless_access === true ? 'yes' : selected_bike.options.keyless_access === null || selected_bike.options.keyless_access === '' ? 'any' : 'no'
						}).then(
							data => {
								navigate('/wait')
							}
						).catch(
							error => {
								alert('Ошибка при оформлении заявки')
							}
						)
					}}>
					<div>
						{language === 'ru' ? text.location.ru : text.location.en}
					</div>
				</button>
			</div>
		</div>
	);
};

export default SendLocation;
