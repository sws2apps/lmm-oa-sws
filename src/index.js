import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import RecoilOutside from 'recoil-outside';
import './i18n';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<RecoilRoot>
		<RecoilOutside />
		<App />
	</RecoilRoot>
);

serviceWorkerRegistration.register();
