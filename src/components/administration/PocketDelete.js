import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import {
	currentPocketState,
	isPocketDeleteState,
	pocketUsersState,
} from '../../appStates/appAdministration';
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
import { apiHostState, uidUserState } from '../../appStates/appSettings';
import { dbSavePerson } from '../../indexedDb/dbPersons';

const PocketDelete = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [pocketUsers, setPocketUsers] = useRecoilState(pocketUsersState);
	const [isPocketDelete, setIsPocketDelete] =
		useRecoilState(isPocketDeleteState);

	const uidUser = useRecoilValue(uidUserState);
	const apiHost = useRecoilValue(apiHostState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const currentPocket = useRecoilValue(currentPocketState);

	const [isProcessing, setIsProcessing] = useState(false);

	const handleDlgClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}

		setIsPocketDelete(false);
	};

	const handleRemovePocket = async () => {
		setIsProcessing(true);
		const reqPayload = {
			cong_id: congID,
			cong_password: congPassword,
			cong_name: congName,
			cong_number: congNumber,
			user_pin: currentPocket.student_PIN,
			app_client: 'lmmoa',
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/pocket-remove-user`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					uid: uidUser,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						await dbSavePerson(currentPocket.id, {
							student_PIN: '',
							viewStudent_Part: [],
						});

						const index = pocketUsers.findIndex(
							(pocket) => pocket.id === currentPocket.id
						);

						if (index > -1) {
							let newPocket = [...pocketUsers];
							newPocket.splice(index, 1);
							setPocketUsers(newPocket);
						}
						handleDlgClose();
					} else {
						setAppMessage(t('global.errorTryAgain'));
						setAppSeverity('error');
						setAppSnackOpen(true);
						setIsProcessing(false);
					}
				})
				.catch((err) => {
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
					setIsProcessing(false);
				});
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<div>
			{isPocketDelete && (
				<Dialog open={isPocketDelete} onClose={handleDlgClose}>
					<DialogTitle>
						<Box sx={{ lineHeight: 1.2 }}>
							{t('administration.pocketUserRemove')}
						</Box>
					</DialogTitle>
					<DialogContent>
						{isProcessing && (
							<Container
								sx={{
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<CircularProgress
									disableShrink
									color='secondary'
									size={'40px'}
								/>
							</Container>
						)}
						{!isProcessing && (
							<Typography>
								{t('administration.pocketUserRemoveDesc', {
									student: currentPocket.person_name,
								})}
							</Typography>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => setIsPocketDelete(false)}
							color='primary'
							disabled={isProcessing}
						>
							{t('global.no')}
						</Button>
						<Button
							onClick={handleRemovePocket}
							color='primary'
							autoFocus
							disabled={isProcessing}
						>
							{t('global.yes')}
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};

export default PocketDelete;
