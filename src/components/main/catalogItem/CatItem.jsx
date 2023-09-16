import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedBike } from '../../../redux/appState/Dataset';
import SwiperBlock from '../../swiperBlock/SwiperBlock';

import s from './CatItem.module.scss';


const TRANSLATIONS = {
	ru: {
		mini: {
			title: 'Мини скутеры',
			subtitle: 'Для девушек / одиночных поездок',
		},
		highways: {
			title: 'Шоссейные',
			subtitle: 'Для путешествий вдвоем',
		},
		luxe: {
			title: 'Премиум',
			subtitle: 'Для поклонников ретро / семьи',
		},
		price_from: 'От'
	},
	en: {
		mini: {
			title: 'Mini scooters',
			subtitle: 'For girls / single trips',
		},
		highways: {
			title: 'Highways',
			subtitle: 'For traveling together',
		},
		luxe: {
			title: 'Premium',
			subtitle: 'For retro / family fans',
		},
		price_from: 'From'
	}
}


export const CatItem = ({ dataset, type, activeIndex }) => {
	const language = useSelector((state) => state.app.language);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const translations = TRANSLATIONS[language] || TRANSLATIONS['ru']
	const text = translations[type];

	function setState() {
		dispatch(
			setSelectedBike({
				type: type,
				model_id: dataset.items[dataset.activeIndex].id,
				name: '',
				date_at: '',
				date_to: '',
				color: '',
				helmet_count: '',
				options: {
					abs: false,
					keyless_access: false,
				},
			}),
		);
	}

	return (
		<div
			className={s.wrapper}
			onClick={() => {
				setState();
				navigate('/catalog');
			}}>
			<div style={{ width: '100%' }}>
				<SwiperBlock type={type} autoplay={true} bikes={dataset.items} activeIndex={dataset.activeIndex} />
			</div>

			<div className={s.info}>
				<div className={s.title_price}>
					<span>{text.title}</span>
					{ dataset.items[dataset.activeIndex] ? (
						<span>
							{translations.price} {dataset.items[dataset.activeIndex].price.toFixed(2)}$
						</span>
					) : '' }
				</div>
				<div className={s.subtitle}>
					<span>{text.subtitle}</span>
				</div>
			</div>
		</div>
	);
};
