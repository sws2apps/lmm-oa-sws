import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const StartMigration = ({ handleSkipStep, handleNext }) => {
	const { t } = useTranslation();
	return (
		<Box>
			<Typography>{t('migration.startBackupDesc')}</Typography>
			<Box sx={{ marginTop: '10px' }}>
				<Button
					variant='contained'
					sx={{ marginRight: '5px' }}
					onClick={handleSkipStep}
				>
					{t('migration.btnNewData')}
				</Button>
				<Button variant='contained' onClick={handleNext}>
					{t('migration.btnMigrateData')}
				</Button>
			</Box>
		</Box>
	);
};

export default StartMigration;
