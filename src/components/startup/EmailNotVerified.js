import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import StartupHeader from './StartupHeader';
import {
	isEmailNotVerifiedState,
	isUserSignInState,
} from '../../appStates/appSettings';

const EmailNotVerified = () => {
	const { t } = useTranslation();

	const setUserSignIn = useSetRecoilState(isUserSignInState);
	const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

	const handleSignIn = () => {
		setUserSignIn(true);
		setEmailNotVerified(false);
	};

	return (
		<StartupHeader>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<img
					src='/img/appLogo.png'
					alt='App logo'
					className={'appLogoStartup'}
				/>
				<Box>
					<Typography align='center' sx={{ lineHeight: 1.2, marginTop: '5px' }}>
						Life and Ministry Meeting Overseer Assistant
					</Typography>
				</Box>
			</Box>

			<Box
				sx={{
					marginTop: '25px',
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '10px',
				}}
			>
				<CheckCircleIcon
					color='success'
					sx={{
						fontSize: '60px',
						cursor: 'pointer',
					}}
				/>
			</Box>

			<Typography sx={{ lineHeight: 1.2, textAlign: 'justify' }}>
				{t('login.verifyAccount')}
			</Typography>

			<Box
				sx={{
					marginTop: '20px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Link component='button' underline='none' variant='body2'>
					{t('login.resendVerify')}
				</Link>
				<Button variant='contained' onClick={handleSignIn}>
					OK
				</Button>
			</Box>
		</StartupHeader>
	);
};

export default EmailNotVerified;
