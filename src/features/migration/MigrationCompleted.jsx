import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const MigrationCompleted = () => {
  const { t } = useTranslation('ui');

  return (
    <Box>
      <Typography sx={{ marginBottom: '10px' }}>{t('cpeMigrationCompletedDesc')}</Typography>
      <Link href="https://cpe-sws.web.app" target="_blank" rel="noopener">
        https://cpe-sws.web.app
      </Link>
    </Box>
  );
};

export default MigrationCompleted;
