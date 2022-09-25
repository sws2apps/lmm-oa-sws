import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	apiHostState,
	rootModalOpenState,
	userEmailState,
	userIDState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';

const User2FA = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();

	const setModalOpen = useSetRecoilState(rootModalOpenState);
	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const userID = useRecoilValue(userIDState);

	const [qrCode, setQrCode] = useState('');
	const [token, setToken] = useState('');
	const [viewerOpen, setViewerOpen] = useState(false);

	const handleCopyClipboard = useCallback(async (text) => {
		await navigator.clipboard.writeText(text);
	}, []);

	const handleClose = useCallback(() => {
		setViewerOpen(false);
	}, []);

	const handleFetch2FA = async () => {
		try {
			if (apiHost !== '') {
				setModalOpen(true);

				const res = await fetch(`${apiHost}api/users/${userID}/2fa`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
						email: userEmail,
					},
				});

				const data = await res.json();

				if (res.status === 200) {
					const qrImg = await QRCode.toDataURL(data.qrCode);
					setQrCode(qrImg);
					setToken(data.secret);
					setModalOpen(false);
					setViewerOpen(true);
					return;
				}

				setModalOpen(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			setModalOpen(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box sx={{ marginTop: '10px', marginBottom: '20px' }}>
			{viewerOpen && (
				<Dialog
					open={viewerOpen}
					onClose={handleClose}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
				>
					<DialogTitle id='alert-dialog-title'>
						{t('settings.twoFactorTitle')}
					</DialogTitle>
					<DialogContent>
						<Typography sx={{ fontSize: '14px' }}>
							<Markup content={t('settings.twoFactorApp')} />
						</Typography>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							{qrCode.length > 0 && (
								<img className='qrcode' src={qrCode} alt='QR Code 2FA' />
							)}
						</Box>
						<Typography sx={{ fontSize: '14px' }}>
							{t('settings.twoFactorToken')}
						</Typography>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								alignItems: 'flex-end',
								marginBottom: '10px',
							}}
						>
							<TextField
								id='outlined-token'
								variant='outlined'
								size='small'
								autoComplete='off'
								value={token}
								multiline
								sx={{ width: '380px', marginTop: '10px' }}
								InputProps={{
									readOnly: true,
								}}
							/>
							<IconButton
								aria-label='copy'
								onClick={() => handleCopyClipboard(token)}
							>
								<ContentCopyIcon />
							</IconButton>
						</Box>
					</DialogContent>
				</Dialog>
			)}
			<Typography>{t('settings.twoFactorDesc')}</Typography>
			<Button onClick={handleFetch2FA} variant='contained'>
				{t('settings.twoFactorAddDevice')}
			</Button>
		</Box>
	);
};

export default User2FA;
