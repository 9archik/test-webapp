import { useEffect, useState } from 'react';
import { get } from '../lib/api';

export function useUser(token) {
	const [state, setState] = useState({
		loading: false,
		user: null,
		error: null,
	});

	useEffect(() => {
		let _mounted = true;
		if (!token) return;

		setState({
			...state,
			loading: true,
		});
		get(`/users/getByToken`, { token })
			.then((data) => {
				_mounted &&
					setState({
						loading: false,
						user: data,
						error: null,
					});
			})
			.catch((e) => {
				if (window.localStorage) {
					window.localStorage.removeItem('auth_token');
					// window.location && window.location.reload && window.location.reload();
				}
				_mounted &&
					setState({
						loading: false,
						user: null,
						error: e,
					});
			});
		return () => (_mounted = false);
	}, [token]);
	return state;
}
