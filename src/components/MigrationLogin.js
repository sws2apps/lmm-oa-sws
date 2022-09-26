import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const MigrationLogin = ({ handleSkipStep, handleNext }) => {
	const { t } = useTranslation();

	const [userTmpPwd, setUserTmpPwd] = useState('');
	const [userTmpEmail, setUserTmpEmail] = useState('');
	const [hasErrorEmail, setHasErrorEmail] = useState(false);
	const [hasErrorPwd, setHasErrorPwd] = useState(false);

	return (
		<Box>
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
			<Box sx={{ marginTop: '15px' }}>
				<Button
					variant='contained'
					sx={{ marginRight: '5px' }}
					onClick={handleSkipStep}
				>
					{t('migration.btnSkip')}
				</Button>
				<Button variant='contained' onClick={handleNext}>
					{t('global.login')}
				</Button>
			</Box>
		</Box>
	);
};

export default MigrationLogin;
