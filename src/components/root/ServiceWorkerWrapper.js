import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { promiseSetRecoil } from 'recoil-outside';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';
import {
	isPrecachedState,
	showReloadState,
	waitingWorkerState,
} from '../../appStates/appSettings';

const onSWInstalled = () => {
	promiseSetRecoil(isPrecachedState, true);
};

const onSWUpdate = (registration) => {
	console.log(registration);
	promiseSetRecoil(showReloadState, true);
	promiseSetRecoil(waitingWorkerState, registration.waiting);
};

serviceWorkerRegistration.register({
	onSuccess: onSWInstalled,
	onUpdate: onSWUpdate,
});

const ServiceWorkerWrapper = (props) => {
	const { updatePwa } = props;
	const { t } = useTranslation();

	const [isPrecached, setIsPrecached] = useRecoilState(isPrecachedState);
	const [showReload, setShowReload] = useRecoilState(showReloadState);

	const waitingWorker = useRecoilValue(waitingWorkerState);

	const reloadPage = () => {
		waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
		updatePwa();
		setShowReload(false);
		window.location.reload();
	};

	return (
		<>
			<Snackbar
				open={showReload}
				message={t('global.newVersion')}
				onClick={reloadPage}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				action={
					<Button color='inherit' size='small' onClick={reloadPage}>
						{t('global.updateApp')}
					</Button>
				}
			/>
			<Snackbar
				open={isPrecached}
				message={t('global.cacheCompleted')}
				onClick={() => setIsPrecached(false)}
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				action={
					<Button
						color='inherit'
						size='small'
						onClick={() => setIsPrecached(false)}
					>
						OK
					</Button>
				}
			/>
		</>
	);
};

export default ServiceWorkerWrapper;
