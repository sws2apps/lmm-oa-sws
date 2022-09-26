import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LaunchIcon from '@mui/icons-material/Launch';
import Link from '@mui/material/Link';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const MigrationComplete = ({ handleReset }) => {
	const { t } = useTranslation();
	return (
		<Box sx={{ marginTop: '20px' }}>
			<Button
				variant='outlined'
				startIcon={<RestartAltIcon />}
				sx={{ marginRight: '5px' }}
				onClick={handleReset}
			>
				{t('migration.btnReset')}
			</Button>
			<Button variant='outlined' startIcon={<LaunchIcon />}>
				<Link
					href='https://lmm-oa-sws.web.app'
					target='_blank'
					rel='noopener'
					underline='none'
				>
					{t('migration.openNew')}
				</Link>
			</Button>
		</Box>
	);
};

export default MigrationComplete;
