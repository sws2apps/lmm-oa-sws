import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MigrationStart = ({ setActiveStep }) => {
  const { t } = useTranslation('ui');

  const handleMoveStep = () => {
    setActiveStep(1);
  };

  return (
    <Box>
      <Typography>{t('cpeMigrationStartDesc')}</Typography>
      <Button variant="contained" onClick={handleMoveStep} sx={{ marginTop: '15px' }}>
        {t('next')}
      </Button>
    </Box>
  );
};

export default MigrationStart;
