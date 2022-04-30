import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// states
import {
	isAppClosingState,
	isAppLoadState,
	isSetupState,
	isUserMfaSetupState,
	isUserMfaVerifyState,
	isUserSignInState,
	userPasswordState,
} from '../../appStates/appSettings';

// utils
import { dbSaveBackup } from '../../indexedDb/dbAppSettings';
import { dbExportJsonDb, initBackupDb } from '../../indexedDb/dbUtility';

const UserSignOut = () => {
	const { t } = useTranslation();

	const [open, setOpen] = useRecoilState(isAppClosingState);

	const setIsAppLoad = useSetRecoilState(isAppLoadState);
	const setIsSetup = useSetRecoilState(isSetupState);
	const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
	const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
	const setUserSignIn = useSetRecoilState(isUserSignInState);

	const userPwd = useRecoilValue(userPasswordState);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway' || reason === 'backdropClick') {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		const handleBackup = async () => {
			const appBackup = await dbExportJsonDb(userPwd);
			await initBackupDb();

			await dbSaveBackup(appBackup);

			setOpen(false);
			setIsAppLoad(true);
			setIsSetup(true);
			setUserMfaSetup(false);
			setUserMfaVerify(false);
			setUserSignIn(true);
		};

		if (open) handleBackup();
	}, [
		open,
		setIsAppLoad,
		setIsSetup,
		setOpen,
		setUserMfaSetup,
		setUserMfaVerify,
		setUserSignIn,
		userPwd,
	]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-close-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-close-title'>
					{t('global.waitSignOut')}
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
		</Box>
	);
};

export default UserSignOut;
