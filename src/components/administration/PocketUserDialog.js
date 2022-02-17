import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PocketUserDetail from './PocketUserDetail';
import {
	childPocketUsersState,
	isPocketAddState,
	parentPocketUserState,
	pocketUsersState,
	userPocketPINState,
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

const PocketUserDialog = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isPocketAddState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const uidUser = useRecoilValue(uidUserState);
	const parentPocketUser = useRecoilValue(parentPocketUserState);
	const childPocketUsers = useRecoilValue(childPocketUsersState);
	const pocketPIN = useRecoilValue(userPocketPINState);
	const apiHost = useRecoilValue(apiHostState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);

	const [pocketUsers, setPocketUsers] = useRecoilState(pocketUsersState);

	const [btnDisabled, setBtnDisabled] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
		setOpen(false);
	};

	const handlePocketUser = async () => {
		setIsProcessing(true);
		setBtnDisabled(true);

		let childUsers = [];
		for (let i = 0; i < childPocketUsers.length; i++) {
			childUsers.push(childPocketUsers[i].id);
		}

		const reqPayload = {
			cong_id: congID,
			cong_password: congPassword,
			cong_name: congName,
			cong_number: congNumber,
			user_pin: pocketPIN,
			user_members: childUsers,
			app_client: 'lmmoa',
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/pocket-add-user`, {
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
						let obj = {};
						obj.parentUser = parentPocketUser;
						obj.PIN = pocketPIN;
						obj.childUsers = childUsers;

						await dbSavePerson(parentPocketUser, {
							student_PIN: pocketPIN,
							viewStudent_Part: childUsers,
						});

						let newPocket = [...pocketUsers];
						newPocket.push(obj);

						setPocketUsers(newPocket);
						handleClose();
					} else {
						setAppMessage(t('global.errorTryAgain'));
						setAppSeverity('error');
						setAppSnackOpen(true);
						setIsProcessing(false);
						setBtnDisabled(false);
					}
				})
				.catch((err) => {
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
					setIsProcessing(false);
					setBtnDisabled(false);
				});
		}
	};

	useEffect(() => {
		if (+pocketPIN > 0 && +parentPocketUser > -1) {
			setBtnDisabled(false);
		} else {
			setBtnDisabled(true);
		}
	}, [pocketPIN, parentPocketUser]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-add-pocket-title'
				aria-describedby='alert-dialog-add-pocket-description'
				sx={{
					overflowY: 'visible',
				}}
			>
				<DialogTitle
					id='alert-dialog-add-pocket-title'
					sx={{
						padding: 0,
						position: 'absolute',
						right: 0,
					}}
				>
					<IconButton
						color='inherit'
						edge='start'
						sx={{ marginRight: '8px' }}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent
					sx={{
						overflowY: 'visible',
					}}
				>
					<>
						<Typography
							sx={{
								fontWeight: 'bold',
								marginTop: '10px',
								marginBottom: '15px',
							}}
						>
							{t('administration.pocketUserAdd')}
						</Typography>
						<PocketUserDetail />
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
					</>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						{t('global.cancel')}
					</Button>
					<Button
						color='primary'
						autoFocus
						disabled={btnDisabled}
						onClick={handlePocketUser}
					>
						{t('global.add')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PocketUserDialog;
