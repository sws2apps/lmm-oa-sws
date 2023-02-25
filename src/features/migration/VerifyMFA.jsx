import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiHandleVerifyOTP } from '../../api/auth';
import { visitorIDState } from '../../states/main';
import { initAppDb } from '../../indexedDb/dbUtility';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const VerifyMFA = ({ setActiveStep }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const visitorID = useRecoilValue(visitorIDState);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleBackStep = () => {
    setActiveStep(1);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyOTP(userOTP, false);

      if (!cancel.current) {
        if (response.success) {
          await initAppDb();
          setIsProcessing(false);
          setActiveStep(4);
          return;
        }

        if (response.tokenInvalid) {
          setIsProcessing(false);
          return;
        }

        setIsProcessing(false);
        setActiveStep(5);
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  }, [setAppMessage, setAppSeverity, setAppSnackOpen, userOTP, setActiveStep]);

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  useEffect(() => {
    const handlePaste = (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      setUserOTP(text);
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ marginBottom: '15px' }}>{t('mfaVerifyDesc')}</Typography>

      <Box sx={{ width: '100%', maxWidth: '450px', marginTop: '20px' }}>
        <MuiOtpInput
          value={userOTP}
          onChange={handleOtpChange}
          length={6}
          display="flex"
          gap={1}
          validateChar={validateChar}
          TextFieldsProps={{ autoComplete: 'off' }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '450px',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Button variant="contained" onClick={handleBackStep}>
          {t('previous')}
        </Button>
        <Button
          variant="contained"
          disabled={isProcessing || visitorID.length === 0}
          onClick={handleVerifyOTP}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('mfaVerify')}
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyMFA;
