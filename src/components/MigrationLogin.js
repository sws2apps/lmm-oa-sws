import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { isEmailValid } from '../utils/emailValid';
import {
	apiHostState,
	isOnlineState,
	visitorIDState,
} from '../appStates/appSettings';
import { dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { congIDState } from '../appStates/appCongregation';
import { encryptString } from '../utils/sws-encryption';

const MigrationLogin = ({ handleSkipStep, handleNext }) => {
	const { t } = useTranslation();
	let abortCont = useMemo(() => new AbortController(), []);

	const setCongID = useSetRecoilState(congIDState);

	const isOnline = useRecoilValue(isOnlineState);
	const visitorID = useRecoilValue(visitorIDState);
	const apiHost = useRecoilValue(apiHostState);

	const [userTmpPwd, setUserTmpPwd] = useState('');
	const [userTmpEmail, setUserTmpEmail] = useState('');
	const [hasErrorEmail, setHasErrorEmail] = useState(false);
	const [hasErrorPwd, setHasErrorPwd] = useState(false);
	const [hasErrorOTP, setHasErrorOTP] = useState(false);
	const [userOTP, setUserOTP] = useState('');
	const [isMfaCheck, setIsMfaCheck] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [errorTxt, setErrorTxt] = useState('');

	const launchSkip = () => {
		setErrorTxt('');
		abortCont.abort();
		handleSkipStep();
	};

	const handleLogin = async () => {
		try {
			setErrorTxt('');
			setHasErrorEmail(false);
			setHasErrorPwd(false);
			if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
				setIsProcessing(true);
				const reqPayload = {
					email: userTmpEmail,
					password: userTmpPwd,
					visitor_id: visitorID,
				};

				if (apiHost !== '') {
					const res = await fetch(`${apiHost}user-login`, {
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(reqPayload),
					});

					const data = await res.json();
					if (res.status === 200) {
						setIsProcessing(false);
						setIsMfaCheck(true);
					} else {
						if (data.secret && data.qrCode) {
							handleSkipStep();
							setIsProcessing(false);
							setErrorTxt(t('migration.noData'));
						} else if (data.message === 'NOT_VERIFIED') {
							handleSkipStep();
							setIsProcessing(false);
							setErrorTxt(t('migration.noData'));
						} else {
							let warnMsg = '';
							if (
								data.message === 'EMAIL_NOT_FOUND' ||
								data.message === 'INVALID_EMAIL' ||
								data.message === 'MISSING_EMAIL'
							) {
								warnMsg = t('login.accountNotFound');
							} else if (data.message === 'INVALID_PASSWORD') {
								warnMsg = t('login.incorrectInfo');
							} else if (data.message === 'USER_DISABLED') {
								warnMsg = t('login.accountDisabled');
							} else if (
								data.message === 'BLOCKED_TEMPORARILY_TRY_AGAIN' ||
								data.message === 'BLOCKED_TEMPORARILY'
							) {
								warnMsg = t('login.hostBlocked');
							} else {
								warnMsg = t('global.errorTryAgain');
							}
							setIsProcessing(false);
							setErrorTxt(warnMsg);
						}
					}
				}
			} else {
				if (!isEmailValid(userTmpEmail)) {
					setHasErrorEmail(true);
				}
				if (userTmpPwd.length < 10) {
					setHasErrorPwd(true);
				}
			}
		} catch (error) {
			setIsProcessing(false);
			setErrorTxt(error.message);
		}
	};

	const handleVerifyToken = async () => {
		try {
			setErrorTxt('');
			setHasErrorOTP(false);

			if (userOTP.length === 6) {
				setIsProcessing(true);
				const reqPayload = {
					token: userOTP,
				};

				if (apiHost !== '') {
					const res = await fetch(`${apiHost}api/mfa/verify-token`, {
						signal: abortCont.signal,
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							visitor_id: visitorID,
							email: userTmpEmail,
						},
						body: JSON.stringify(reqPayload),
					});

					const data = await res.json();
					if (res.status === 200) {
						const { cong_id, cong_name, cong_role, cong_number } = data;

						if (cong_name.length > 0) {
							if (cong_role.length > 0) {
								// role approved
								if (
									cong_role.includes('lmmo') ||
									cong_role.includes('lmmo-backup')
								) {
									setCongID(cong_id);
									// encrypt email & pwd
									const encPwd = await encryptString(
										userTmpPwd,
										JSON.stringify({ email: userTmpEmail, pwd: userTmpPwd })
									);

									// save congregation update if any
									let obj = {};
									obj.username = data.username;
									obj.isCongVerified = true;
									obj.cong_name = cong_name;
									obj.cong_number = cong_number;
									obj.userPass = encPwd;
									obj.isLoggedOut = false;

									await dbUpdateAppSettings(obj);

									setIsProcessing(false);
									handleNext();
								}
								return;
							}

							handleSkipStep();
							setIsProcessing(false);
							setErrorTxt(t('migration.noData'));
							return;
						}

						handleSkipStep();
						setIsProcessing(false);
						setErrorTxt(t('migration.noData'));
					} else {
						setIsProcessing(false);
						setErrorTxt(data.message);
					}
				}
			} else {
				setHasErrorOTP(true);
			}
		} catch (error) {
			setIsProcessing(false);
			setErrorTxt(error.message);
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<Box>
			{isMfaCheck && (
				<Box
					sx={{
						marginTop: '10px',
						maxWidth: '290px',
					}}
				>
					<TextField
						id='outlined-otp'
						type='number'
						label={t('login.labelOTP')}
						variant='outlined'
						size='small'
						autoComplete='off'
						required
						value={userOTP}
						onChange={(e) => setUserOTP(e.target.value)}
						error={hasErrorOTP ? true : false}
						sx={{ width: '100%' }}
					/>
				</Box>
			)}
			{!isMfaCheck && (
				<Box
					sx={{
						marginTop: '10px',
						display: 'flex',
						flexDirection: 'column',
						maxWidth: '350px',
					}}
				>
					<TextField
						id='outlined-email'
						label={t('login.email')}
						variant='outlined'
						size='small'
						autoComplete='off'
						required
						value={userTmpEmail}
						onChange={(e) => setUserTmpEmail(e.target.value)}
						error={hasErrorEmail ? true : false}
					/>
					<TextField
						sx={{ marginTop: '15px' }}
						id='outlined-password'
						label={t('login.password')}
						type='password'
						variant='outlined'
						size='small'
						autoComplete='off'
						required
						value={userTmpPwd}
						onChange={(e) => setUserTmpPwd(e.target.value)}
						error={hasErrorPwd ? true : false}
					/>
				</Box>
			)}
			{errorTxt.length > 0 && (
				<Box sx={{ marginTop: '15px' }}>
					<Typography sx={{ color: 'red', fontWeight: 'bold' }}>
						{errorTxt}
					</Typography>
				</Box>
			)}

			<Box sx={{ marginTop: '15px' }}>
				<Button
					variant='contained'
					sx={{ marginRight: '5px' }}
					onClick={launchSkip}
				>
					{t('migration.btnSkip')}
				</Button>
				<Button
					variant='contained'
					disabled={visitorID.length === 0 || !isOnline || isProcessing}
					onClick={isMfaCheck ? handleVerifyToken : handleLogin}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{isProcessing && (
							<CircularProgress
								disableShrink
								color='secondary'
								size={'25px'}
								sx={{ marginRight: '10px' }}
							/>
						)}
						{isMfaCheck ? t('login.mfaVerify') : t('global.login')}
					</Box>
				</Button>
			</Box>
		</Box>
	);
};

export default MigrationLogin;
