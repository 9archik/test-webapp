import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y , Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAbs, setActiveIndex } from './../../redux/appState/Dataset';
import styles from './SwiperBlock.module.scss';
import ImageComponent from '../imageComponent/imageComponent';
import ContentLoader from 'react-content-loader';
import { useSwiper } from 'swiper/react';

const SwiperBlock = ({ bikes, autoplay, type, defaultIndex, activeIndex }) => {
	const ref = useRef();
	const [height, setHeight] = useState(ref?.current?.offsetHeight);
	const [bikesState, setBikesState] = useState([]);

	const swiperRef = useRef();

	useEffect(() => {
		const array = bikes.map((el, index) => {
			return { ...el, active: activeIndex == index };
		});
		setBikesState(array);
	}, [JSON.stringify(bikes)]);

	useLayoutEffect(() => {
		const resizeBlock = () => {
			console.log(ref);
			if (ref.current) {
				setHeight(ref.current.offsetHeight);
			}
		};

		if (ref.current) {
			setHeight(ref.current.offsetWidth / 1.78);
		}

		const array = bikes.map((el, index) => {
			if (!defaultIndex && index === 0) return { ...el, active: true };
			else if (index === defaultIndex) return { ...el, active: true };
			else return { ...el, active: false };
		});

		setBikesState(array);

		window.addEventListener('resize', resizeBlock);

		return () => window.removeEventListener('resize', resizeBlock);
	}, []);

	const dispatch = useDispatch();

	useEffect(() => {
		if (type && !defaultIndex) {
			dispatch(setActiveIndex({ key: type, activeIndex: 0 }));
		}
	}, []);

	return (
		<div className={styles.block} ref={ref}>
			{bikesState.length > 0 ? (
				<>
					<Swiper
						onSwiper={(swiper) => {
							swiperRef.current = swiper;
						}}
						style={{
							'--swiper-pagination-color': '#FFF',
							'--swiper-pagination-bullet-inactive-color': 'rgba(0, 0, 0, 0.40)',
							'--swiper-pagination-bullet-inactive-opacity': '1',
							'--swiper-pagination-bullet-size': '7px',
							'--swiper-pagination-bullet-horizontal-gap': '2px',
						}}
						onSlideChange={(swiper) => {
							if (type) {
								dispatch(setActiveIndex({ key: type, activeIndex: swiper.realIndex }));
							}
							const array = [...bikesState];
							array[swiper.realIndex] = { ...array[swiper.realIndex], active: true };
							setBikesState(array);
						}}
						autoplay={autoplay && { delay: 10000 }}
						spaceBetween={30}
						slidesPerView={1}
						loop
				
						initialSlide={defaultIndex ? defaultIndex : 0}
						modules={[Navigation, Pagination, A11y, Autoplay]}
						pagination={{ clickable: true, type: 'bullets' }}>
						{bikesState.map((el, index) => {
							return (
								<SwiperSlide>
									<div className={styles.container}>
										<ImageComponent
											index={index}
											setBikesState={setBikesState}
											active={el.active}
											src={el.img}
											height={height}
										/>
										<div className={styles.nameBike}>{el.name}</div>
									</div>
								</SwiperSlide>
							);
						})}
					</Swiper>
					<button
						onClick={(e) => {
							e.stopPropagation();
							swiperRef.current.slidePrev();
						}}
						className={styles.prev}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none">
							<path
								d="M12.4434 14.8889L7.55447 10L12.4434 5.11111"
								stroke="white"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							swiperRef.current.slideNext();
						}}
						className={styles.next}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="21"
							height="22"
							viewBox="0 0 21 22"
							fill="none">
							<path
								d="M7.97852 16.0417L13.0202 11L7.97852 5.95834"
								stroke="white"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</>
			) : (
				<ContentLoader
					speed={2}
					width={height * 1.78}
					height={height ? height : 0}
					viewBox={height ? `0 0 ${height * 1.78} ${height}` : null}
					backgroundColor="#f3f3f3"
					foregroundColor="#ecebeb">
					<rect x="0" y="0" rx="0" ry="0" width={height * 2} height={height} />
				</ContentLoader>
			)}
		</div>
	);
};

export default SwiperBlock;
