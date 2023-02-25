import { useEffect, useRef } from 'react';
import { Markup } from 'interweave';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OAuth from './OAuth';

const SignIn = ({ setActiveStep }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const handleBackStep = () => {
    setActiveStep(1);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ marginBottom: '20px' }}>
        <Markup content={t('signInDesc')} />
      </Typography>

      <OAuth />
      <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <Button variant="contained" onClick={handleBackStep}>
          {t('previous')}
        </Button>
      </Box>
    </Box>
  );
};

export default SignIn;
