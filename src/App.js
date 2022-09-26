import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import usePwa2 from 'use-pwa2/dist/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InternetChecker from './components/root/InternetChecker';
import ServiceWorkerWrapper from './components/root/ServiceWorkerWrapper';
import { apiHostState, appStageState } from './appStates/appSettings';
import Migration from './pages/Migration';

const theme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			xs420: 420,
			sm: 600,
			sm800: 800,
			md: 900,
			lg: 1280,
			xl: 1536,
		},
	},
});

const App = ({ updatePwa }) => {
	const { enabledInstall } = usePwa2();

	const setApiHost = useSetRecoilState(apiHostState);
	const setAppStage = useSetRecoilState(appStageState);

	useEffect(() => {
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			setApiHost('http://localhost:8000/');
			setAppStage('local');
		} else {
			const appUrl = window.location.hostname;
			if (
				appUrl === 'dev-lmm-oa-sws.web.app' ||
				appUrl === 'dev-lmm-oa-sws.firebaseapp.com'
			) {
				setApiHost('https://alpha-sws2apps-api.onrender.com/');
				setAppStage('ALPHA Release');
			}
		}
	}, [setApiHost, setAppStage]);

	useEffect(() => {
		if (!indexedDB) {
			if ('serviceWorker' in navigator) {
			} else {
				return (
					<div className='browser-not-supported'>
						You seem to use an unsupported browser to use LMM-OA. Make sure that
						you browser is up to date, or try to use another browser.
					</div>
				);
			}
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<InternetChecker />
			<ServiceWorkerWrapper
				enabledInstall={enabledInstall}
				updatePwa={updatePwa}
			/>
			<Migration />
		</ThemeProvider>
	);
};

export default App;
