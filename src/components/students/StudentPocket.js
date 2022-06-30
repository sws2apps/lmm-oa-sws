import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	apiHostState,
	userEmailState,
	visitorIDState,
} from '../../appStates/appSettings';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../../appStates/appNotification';
import { congIDState } from '../../appStates/appCongregation';

const StudentPocket = ({ id, name }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const { t } = useTranslation();

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const userEmail = useRecoilValue(userEmailState);
	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const congID = useRecoilValue(congIDState);

	const [isGettingUser, setIsGettingUser] = useState(true);
	const [devices, setDevices] = useState([]);
	const [verifyCode, setVerifyCode] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [pocketName, setPocketName] = useState('');

	const handleGenerateOCode = async () => {
		try {
			if (apiHost !== '') {
				setIsGenerating(true);
				setVerifyCode('');
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/pockets/${id}/code`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setVerifyCode(data.code);
					setIsGenerating(false);
					return;
				}

				setIsGenerating(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setIsGenerating(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	};

	const handleUpdatePocketUsername = async () => {
		try {
			if (apiHost !== '') {
				setIsGenerating(true);
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/pockets/${id}/username`,
					{
						signal: abortCont.signal,
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
						body: JSON.stringify({ username: name }),
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setPocketName(data.username);
					setIsGenerating(false);
					return;
				}

				setIsGenerating(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setIsGenerating(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	};

	const handleSetupPocket = async () => {
		try {
			if (apiHost !== '') {
				setIsGenerating(true);
				setVerifyCode('');
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/pockets/${id}`,
					{
						signal: abortCont.signal,
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
						body: JSON.stringify({ username: name }),
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setVerifyCode(data.code);
					setPocketName(data.username);
					setIsGenerating(false);
					return;
				}

				setIsGenerating(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setIsGenerating(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	};

	const fetchPocketUser = useCallback(async () => {
		try {
			if (apiHost !== '') {
				setIsGenerating(false);
				setIsGettingUser(true);
				setDevices([]);
				setVerifyCode('');
				const res = await fetch(
					`${apiHost}api/congregations/${congID}/pockets/${id}`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userEmail,
						},
					}
				);

				const data = await res.json();

				if (res.status === 200) {
					setDevices(data.pocket_devices);
					setVerifyCode(data.pocket_oCode);
					setPocketName(data.username);
					setIsGettingUser(false);
					return;
				}

				if (data.message === 'POCKET_NOT_FOUND') {
					setIsGettingUser(false);
					return;
				}

				setIsGettingUser(false);
				setAppMessage(data.message);
				setAppSeverity('warning');
				setAppSnackOpen(true);
			}
		} catch (err) {
			if (!abortCont.signal.aborted) {
				setIsGettingUser(false);
				setAppMessage(err.message);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		}
	}, [
		abortCont,
		apiHost,
		congID,
		id,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		userEmail,
		visitorID,
	]);

	useEffect(() => {
		fetchPocketUser();
	}, [fetchPocketUser]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			{isGettingUser && (
				<CircularProgress
					color='secondary'
					size={40}
					disableShrink={true}
					sx={{
						display: 'flex',
						margin: '10px auto',
					}}
				/>
			)}
			{!isGettingUser && (
				<Box
					sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
				>
					<Typography sx={{ fontWeight: 'bold', marginRight: '5px' }}>
						{pocketName}
					</Typography>
					{name !== pocketName && (
						<IconButton
							onClick={handleUpdatePocketUsername}
							disabled={isGenerating}
						>
							<CloudSyncIcon color='primary' />
						</IconButton>
					)}
				</Box>
			)}
			{!isGettingUser && verifyCode.length === 0 && devices.length === 0 && (
				<Button
					variant='contained'
					sx={{ marginBottom: '15px' }}
					disabled={isGenerating}
					onClick={handleSetupPocket}
				>
					{t('students.setupPocketAccess')}
				</Button>
			)}
			{!isGettingUser && verifyCode.length === 0 && devices.length > 0 && (
				<Button
					variant='contained'
					sx={{ marginBottom: '15px' }}
					disabled={isGenerating}
					onClick={handleGenerateOCode}
				>
					{t('students.addPocketDevice')}
				</Button>
			)}
			{isGenerating && (
				<CircularProgress
					color='secondary'
					size={30}
					disableShrink={true}
					sx={{
						marginLeft: '10px',
						marginTop: '10px',
						display: 'flex',
						alignItems: 'center',
					}}
				/>
			)}
			{!isGettingUser && verifyCode.length > 0 && (
				<Box sx={{ marginBottom: '15px', marginTop: '10px' }}>
					<Typography>{t('students.setupPocketToken')}</Typography>
					<TextField
						id='outlined-token'
						variant='outlined'
						size='small'
						autoComplete='off'
						value={verifyCode}
						multiline
						sx={{ width: '150px', marginTop: '5px' }}
						InputProps={{
							readOnly: true,
						}}
					/>
				</Box>
			)}
		</Box>
	);
};

export default StudentPocket;
