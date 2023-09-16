import React, { useEffect, useState } from 'react';
import { useUser } from './hooks/user';
import { TelegramWebAppContext } from './context/telegram';
import { UserContext } from './context/user';
import { AppRoutes } from './AppRoutes';
import { post } from './lib/api';
import { TokenContext } from './context/auth';
import { useOptions } from './hooks/misc';
import { OptionsContext } from './context/misc';
import svg from './static/images/loader.svg';
import './App.css';


function App() {
	const WebApp = window.Telegram.WebApp;
	const params = new URLSearchParams(window.location.search)
	const token = params.get('token')
	if(token && window.localStorage) {
		window.localStorage.setItem('auth_token', token)
	}
	const [ state, setState ] = useState({
		loading: false,
		token: window.localStorage ? window.localStorage.getItem('auth_token') : token,
		error: null
	})
	const options = useOptions()
	
	if(WebApp) {
		WebApp.expand()
	}

	useEffect(() => {
		var _mounted = true
		if(WebApp.initData) {
			setState({...state, loading: true})
			post('/users/loginByInitData', {}, decodeURIComponent(WebApp.initData)).then(
				data => {
					_mounted && setState({
						loading: false,
						token: data.token,
						error: null
					})
				}
			).catch(alert)
		}
		return () => _mounted = false
	}, [WebApp.initData])

	const { loading, user, error } = useUser(state.token)
	if(state.loading || loading) {
		return <div style={{ textAlign: 'center', padding: '20px', height: '100vh', display: 'flex', justifyContent: 'center' }}>
			<img src={ svg } alt='Loading' style={{ width: 64 }} />
		</div>
	}

	return (
		<>
			<TelegramWebAppContext.Provider value={WebApp}>
				<TokenContext.Provider value={state.token}>
					<UserContext.Provider value={user}>
						<OptionsContext.Provider value={options.options}>
							<AppRoutes />
						</OptionsContext.Provider>
					</UserContext.Provider>
				</TokenContext.Provider>
			</TelegramWebAppContext.Provider>
		</>
	);
}

export default App;
