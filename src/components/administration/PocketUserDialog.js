import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
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
	isSavingPocketUserState,
	parentPocketUserState,
	pocketUsersState,
	userPocketPINState,
} from '../../appStates/appAdministration';
// import { dbSavePerson } from '../../indexedDb/dbPersons';

const PocketUserDialog = () => {
	const { t } = useTranslation();

	const [open, setOpen] = useRecoilState(isPocketAddState);

	const parentPocketUser = useRecoilValue(parentPocketUserState);
	const childPocketUsers = useRecoilValue(childPocketUsersState);
	const isProcessing = useRecoilValue(isSavingPocketUserState);
	const pocketPIN = useRecoilValue(userPocketPINState);

	const [pocketUsers, setPocketUsers] = useRecoilState(pocketUsersState);

	const [btnDisabled, setBtnDisabled] = useState(true);

	const handleClose = (event, reason) => {
		if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
			return;
		}
		setOpen(false);
	};

	const handlePocketUserAdd = async () => {
		let childUsers = [];
		for (let i = 0; i < childPocketUsers.length; i++) {
			childUsers.push(childPocketUsers[i].id);
		}

		let obj = {};
		obj.parentUser = parentPocketUser;
		obj.PIN = pocketPIN;
		obj.childUsers = childUsers;

		let newPocket = pocketUsers;
		newPocket.push(obj);

		setPocketUsers(newPocket);
	};

	useEffect(() => {
		if (pocketPIN) {
			setBtnDisabled(false);
		} else {
			setBtnDisabled(true);
		}
	}, [pocketPIN]);

	return (
		<Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-add-pocket-title'
				aria-describedby='alert-dialog-add-pocket-description'
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
				<DialogContent>
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
						onClick={handlePocketUserAdd}
					>
						{t('global.add')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PocketUserDialog;
