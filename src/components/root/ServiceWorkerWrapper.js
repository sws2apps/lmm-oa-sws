import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';

const ServiceWorkerWrapper = (props) => {
	const { updatePwa } = props;
	const { t } = useTranslation();

	const [showReload, setShowReload] = useState(false);
	const [isPrecached, setIsPrecached] = useState(false);
	const [waitingWorker, setWaitingWorker] = useState(null);

	const onSWUpdate = (registration) => {
		console.log(registration);
		setShowReload(true);
		setWaitingWorker(registration.waiting);
	};

	const onSWInstalled = () => {
		setIsPrecached(true);
	};

	useEffect(() => {
		serviceWorkerRegistration.register({
			onUpdate: onSWUpdate,
			onSuccess: onSWInstalled,
		});
	});

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
