import { useContext } from 'react';
import { UserContext } from './context/user';
import { Routes, Route } from 'react-router-dom';
import { First } from './components/first/First';
import { Main } from './components/main/Main';
import { Catalog } from './components/catalog/Catalog';
import { Wait } from './components/wait/Wait';
import { About } from './components/about/About';
import { Support } from './components/support/Support';
import SendLocation from './components/sendLocation/SendLocation';
import { TelegramLoginButton } from './components/login/TelegramLoginButton';

export function AppRoutes() {
	const user = useContext(UserContext);

	return (
		<Routes>
			<Route path="/" element={<First />} />
			<Route path="/main" element={<Main />} />
			<Route path="/catalog" element={<Catalog />} />
			<Route path="/wait" element={<Wait />} />
			<Route path="/about" element={<About />} />
			<Route path="/support" element={<Support />} />
			<Route path="/location" element={<SendLocation />} />
		</Routes>
	);
	// } else {
	//     return (
	//         <div style={{ textAlign: 'center' }}>
	//             <TelegramLoginButton />
	//         </div>
	//     )
	// }
}
