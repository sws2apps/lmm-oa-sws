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
	isPocketEditState,
	pocketEditTypeState,
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
import { dbGetStudentDetails, dbSavePerson } from '../../indexedDb/dbPersons';

const PocketUserDialog = () => {
	const { t } = useTranslation();

	let abortCont = useMemo(() => new AbortController(), []);

	const [open, setOpen] = useRecoilState(isPocketAddState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const uidUser = useRecoilValue(uidUserState);
	const apiHost = useRecoilValue(apiHostState);
	const congID = useRecoilValue(congIDState);
	const congPassword = useRecoilValue(congPasswordState);
	const congName = useRecoilValue(congNameState);
	const congNumber = useRecoilValue(congNumberState);
	const pocketEditType = useRecoilValue(pocketEditTypeState);

	const [parentPocketUser, setparentPocketUser] = useRecoilState(
		parentPocketUserState
	);
	const [pocketUsers, setPocketUsers] = useRecoilState(pocketUsersState);
	const [childPocketUsers, setChildPocketUsers] = useRecoilState(
		childPocketUsersState
	);
	const [pocketPIN, setPocketPIN] = useRecoilState(userPocketPINState);
	const [isPocketEdit, setIsPocketEdit] = useRecoilState(isPocketEditState);

	const [btnDisabled, setBtnDisabled] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [previousPIN] = useState(pocketPIN);

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}

		setOpen(false);
		setIsPocketEdit(false);
		setChildPocketUsers([]);
		setPocketPIN('');
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
			user_pinPrev: `${pocketPIN === previousPIN ? '' : previousPIN}`,
			pocket_type: pocketEditType,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/congregation/pocket-edit-user`, {
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
						await dbSavePerson(parentPocketUser.id, {
							student_PIN: pocketPIN,
							viewStudent_Part: childUsers,
						});

						const student = await dbGetStudentDetails(parentPocketUser.id);

						let dispPart = [];
						let allPart = [];
						for (let a = 0; a < childUsers.length; a++) {
							const child = await dbGetStudentDetails(childUsers[a]);
							dispPart.push(child.person_displayName);
							allPart.push(child);
						}

						const obj = {
							...student,
							viewPartName: dispPart,
							viewPartFull: allPart,
						};

						let newPocket = [...pocketUsers];

						const index = newPocket.findIndex((pocket) => pocket.id === obj.id);
						if (index > -1) {
							newPocket.splice(index, 1);
						}

						newPocket.push(obj);

						newPocket.sort((a, b) => {
							return a.person_name > b.person_name ? 1 : -1;
						});

						setPocketUsers(newPocket);
						setChildPocketUsers([]);
						setPocketPIN('');
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
		if (+pocketPIN > 0 && parentPocketUser) {
			setBtnDisabled(false);
		} else {
			setBtnDisabled(true);
		}
	}, [pocketPIN, parentPocketUser]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	useEffect(() => {
		if (open && !isPocketEdit) {
			setparentPocketUser(null);
		}
	}, [open, isPocketEdit, setparentPocketUser]);

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
								marginBottom: '25px',
							}}
						>
							{isPocketEdit
								? t('administration.pocketUserEdit')
								: t('administration.pocketUserAdd')}
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
						{isPocketEdit ? t('global.save') : t('global.add')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PocketUserDialog;
