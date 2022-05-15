import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilOutside, { promiseSetRecoil } from 'recoil-outside';
import WithServiceWorker from './components/root/WithServiceWorker';
import './i18n';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global.css';
import { isPrecachedState, showReloadState } from './appStates/appSettings';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<RecoilRoot>
		<RecoilOutside />
		<WithServiceWorker
			registerOnMount={process.env.NODE_ENV === 'production'}
			onError={(err) => console.log(`An error occured: ${err}`)}
			onInstalled={() => onSWInstalled()}
			onUpdated={() => onSWUpdated()}
			onStaled={() => onSWUpdated()}
			publicServiceWorkerDest='/service-worker.js'
		>
			{({ update }) => <App updatePwa={update} />}
		</WithServiceWorker>
	</RecoilRoot>
);

const onSWInstalled = () => {
	promiseSetRecoil(isPrecachedState, true);
	console.log('Service worker installed');
};

const onSWUpdated = () => {
	promiseSetRecoil(showReloadState, true);
	console.log('Service worker updated');
};
