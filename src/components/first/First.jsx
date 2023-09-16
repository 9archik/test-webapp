import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '../icon/Icon';
import s from './First.module.scss';
import Modal from '../modal/Modal';
import SelectLang from './selectLang/SelectLang';
import { UserContext } from '../../context/user';
import { setLanguage } from '../../redux/appState/AppSlice';


export const First = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useContext(UserContext)
	const isSelected = useSelector((state) => state.app.isSelected);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if(user?.user?.language) {
			dispatch(setLanguage(user.user.language))
			navigate('/main')
			return
		}
		let timer = setTimeout(() => {
			if(user && user.user.language) {
				dispatch(setLanguage(user.user.language))
				navigate('/main')
				return
			}
			setOpenModal(true);
		}, 500);

		return () => clearTimeout(timer);
	}, [JSON.stringify(user)]);

	return (
		<>
			<div
				className={s.wrapper}
				onClick={() => {
					if (isSelected) navigate('/main');
				}}>
				<Icon>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="41"
						height="50"
						viewBox="0 0 41 50"
						fill="none">
						<path
							d="M20.3424 0.76442C9.1496 0.76442 0.0791016 9.88084 0.0791016 21.1219C0.0791016 32.363 9.1496 41.4795 20.3424 41.4795V49.9399L34.1952 35.977C38.1407 32.2641 40.6056 26.9818 40.6056 21.1219C40.6066 9.88084 31.5324 0.76442 20.3424 0.76442ZM20.2736 27.3812C18.6576 27.3812 17.1827 26.7644 16.0718 25.7511H16.069L15.6929 25.376L15.6446 25.3246L11.3796 21.1005H14.022C14.022 17.6321 16.8214 14.8207 20.2727 14.8207C23.7278 14.8207 26.5262 17.6331 26.5262 21.1005C26.5271 24.5688 23.7287 27.3812 20.2736 27.3812Z"
							fill="#54667A"
						/>
					</svg>
				</Icon>
				<div className={s.title}>
					<p>Impulse</p>
					<p>Bike rental marketplace</p>
				</div>
			</div>
			{
				<Modal active={openModal && !isSelected}>
					<SelectLang active={openModal && !isSelected} />
				</Modal>
			}
		</>
	);
};
