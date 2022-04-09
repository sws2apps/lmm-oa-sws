import { lazy, Suspense, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { HashRouter, Route, Routes } from 'react-router-dom';
import usePwa2 from 'use-pwa2/dist/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppNotification from './components/root/AppNotification';
import DBRestore from './pages/DBRestore';
import InternetChecker from './components/root/InternetChecker';
import Layout from './components/root/Layout';
import ServiceWorkerWrapper from './components/root/ServiceWorkerWrapper';
import Startup from './pages/Startup';
import {
	apiHostState,
	appStageState,
	isAppLoadState,
} from './appStates/appSettings';
import { appSnackOpenState } from './appStates/appNotification';

const Home = lazy(() => import('./pages/Home'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Settings = lazy(() => import('./pages/Settings'));
const SourceMaterial = lazy(() => import('./pages/SourceMaterial'));
const Students = lazy(() => import('./pages/Students'));
const ScheduleTemplate = lazy(() => import('./template/ScheduleTemplate'));
const S89Template = lazy(() => import('./template/S89Template'));
const Administration = lazy(() => import('./pages/Administration'));

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

const App = () => {
	const { enabledInstall, installPwa, isLoading, updatePwa } = usePwa2();
	const isAppLoad = useRecoilValue(isAppLoadState);
	const appSnackOpen = useRecoilValue(appSnackOpenState);

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
				setApiHost('https://dev-sws2apps.herokuapp.com/');
				setAppStage('DEV Environment');
			} else if (
				appUrl === 'staging-lmm-oa-sws.web.app' ||
				appUrl === 'staging-lmm-oa-sws.firebaseapp.com'
			) {
				setApiHost('https://staging-sws2apps.herokuapp.com/');
				setAppStage('STG Environment');
			} else if (
				appUrl === 'lmm-oa-sws.web.app' ||
				appUrl === 'lmm-oa-sws.firebaseapp.com'
			) {
				setApiHost('https://dev-sws2apps.herokuapp.com/');
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
			<ServiceWorkerWrapper updatePwa={updatePwa} />
			{appSnackOpen && <AppNotification />}
			{isAppLoad && <Startup />}
			{!isAppLoad && (
				<Suspense fallback={<div></div>}>
					<HashRouter>
						<Layout
							enabledInstall={enabledInstall}
							isLoading={isLoading}
							installPwa={installPwa}
						>
							<Routes>
								<Route path='/' element={<Home />} />
								<Route path='/Students' element={<Students />} />
								<Route path='/Schedule' element={<Schedule />} />
								<Route
									path='/ScheduleTemplate'
									element={<ScheduleTemplate />}
								/>
								<Route path='/S89Template' element={<S89Template />} />
								<Route path='/SourceMaterial' element={<SourceMaterial />} />
								<Route path='/Settings' element={<Settings />} />
								<Route path='/Administration' element={<Administration />} />
								<Route path='/DBRestore' element={<DBRestore />} />
							</Routes>
						</Layout>
					</HashRouter>
				</Suspense>
			)}
		</ThemeProvider>
	);
};

export default App;
