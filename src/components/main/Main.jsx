import { useDispatch, useSelector } from 'react-redux';
import { Footer } from '../footer/Footer';
import { CatItem } from './catalogItem/CatItem';

import s from './Main.module.scss';
import { useEffect } from 'react';
import { get } from '../../lib/api';
import { setCategories } from '../../redux/appState/Dataset';


export const Main = () => {
	const language = useSelector((state) => state.app.language);
	const dataset = useSelector(state => state.dataset)
	const dispatch = useDispatch()

	useEffect(() => {
        get('/bikes/categories', {}).then(
            data => {
                dispatch(setCategories(data))
            }
        ).catch(
            console.log
        )
    }, [JSON.stringify(dataset), language])
	
	let title = 'Выберите тип скутера'

	if(language === 'en') {
		title = 'Choose the type of scooter'
	}

	return (
		<>
			<div className={s.wrapper}>
				<div className={s.title}>{title}</div>
				<div className={s.items}>
					<CatItem dataset={dataset.mini} type='mini' />
					<CatItem dataset={dataset.highways} type='highways' />
					<CatItem dataset={dataset.luxe} type='luxe' />
				</div>
			</div>
			<Footer />
		</>
	);
};
