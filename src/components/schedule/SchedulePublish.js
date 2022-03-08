import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import {
	congIDState,
	congNameState,
	congNumberState,
	congPasswordState,
} from '../../appStates/appCongregation';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import {
	currentScheduleState,
	isPublishOpenState,
	publishSchedTypeState,
} from '../../appStates/appSchedule';
import { apiHostState, uidUserState } from '../../appStates/appSettings';
import { dbBuildScheduleForShare } from '../../indexedDb/dbSchedule';

const SchedulePublish = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isPublishOpenState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const uidUser = useRecoilValue(uidUserState);
	const apiHost = useRecoilValue(apiHostState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const publishType = useRecoilValue(publishSchedTypeState);
	const currentSchedule = useRecoilValue(currentScheduleState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);

	const handleClose = useCallback(
		(event, reason) => {
			if (reason === 'clickaway' || reason === 'backdropClick') {
				return;
			}
			setOpen(false);
		},
		[setOpen]
	);

	const publishSchedulePocket = useCallback(async () => {
		const dataPocket = await dbBuildScheduleForShare(currentSchedule);

		const reqPayload = {
			cong_id: congID,
			cong_password: congPassword,
			cong_name: congName,
			cong_number: congNumber,
			pocket_data: dataPocket,
			pocket_schedule: currentSchedule,
		};

		fetch(`${apiHost}api/congregation/pocket-send-schedule`, {
			signal: abortCont.signal,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				uid: uidUser,
			},
			body: JSON.stringify(reqPayload),
		})
			.then(async (res) => {
				const data = await res.json();
				if (res.status === 200) {
					setAppMessage(t('schedule.publishSuccess'));
					setAppSeverity('success');
					setAppSnackOpen(true);
				} else {
					let warnMsg;
					if (data.message === 'WAIT_FOR_REQUEST') {
						warnMsg = t('global.waitForRequest');
					} else {
						warnMsg = t('global.errorTryAgain');
					}
					setAppMessage(warnMsg);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
				handleClose();
			})
			.catch((err) => {
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
				handleClose();
			});
	}, [
		currentSchedule,
		congID,
		congPassword,
		handleClose,
		abortCont,
		apiHost,
		congName,
		congNumber,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		t,
		uidUser,
	]);

	useEffect(() => {
		if (publishType === 'sws-pocket') {
			publishSchedulePocket();
		}
	}, [publishType, publishSchedulePocket]);

	return (
		<div>
			<Dialog
				open={open}
				aria-labelledby='dialog-title-publish'
				onClose={handleClose}
			>
				<DialogTitle id='dialog-title-publish'>
					<Typography variant='h6' component='p'>
						{publishType === 'sws-pocket'
							? t('schedule.publishPocket')
							: t('schedule.publishMSC')}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<CircularProgress
						color='secondary'
						size={80}
						disableShrink={true}
						sx={{
							display: 'flex',
							margin: '10px auto',
						}}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default SchedulePublish;
