import { useEffect, useRef, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { isEmailAuthState, isOAuthAccountUpgradeState } from '../../states/main';
import { isEmailValid } from '../../utils/emailValid';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiRequestPasswordlesssLink } from '../../api';

const EmailAuth = ({ setAccountVersion }) => {
  const { t } = useTranslation('ui');

  const cancel = useRef();

  const setIsEmailAuth = useSetRecoilState(isEmailAuthState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const isOAuthAccountUpgrade = useRecoilValue(isOAuthAccountUpgradeState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [userTmpEmail, setUserTmpEmail] = useState('');

  const handleProviderSignIn = () => {
    setIsEmailAuth(false);
    setAccountVersion('v2');
  };

  const handleSendLink = async () => {
    cancel.current = false;

    if (!isEmailValid(userTmpEmail)) {
      setAppMessage(t('emailNotSupported'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
      return;
    }

    setIsProcessing(true);

    if (isOAuthAccountUpgrade) {
      const auth = await getAuth();
      if (auth) {
        const user = auth.currentUser;
        const currentEmail = user.email;

        if (currentEmail !== userTmpEmail) {
          setAppMessage(t('oauthAccountUpgradeEmailMismatch'));
          setAppSeverity('warning');
          setAppSnackOpen(true);
          return;
        }

        await apiRequestPasswordlesssLink(userTmpEmail, user.uid);
      }

      if (!auth) {
        await apiRequestPasswordlesssLink(userTmpEmail);
      }
    } else {
      await apiRequestPasswordlesssLink(userTmpEmail);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    const fillDetailsUpgrade = async () => {
      const auth = await getAuth();
      const user = auth?.currentUser;
      setUserTmpEmail(user?.email || '');
    };

    if (isOAuthAccountUpgrade) fillDetailsUpgrade();

    return () => {
      cancel.current = true;
    };
  }, [isOAuthAccountUpgrade]);

  return (
    <Box sx={{ maxWidth: '400px', marginTop: '20px' }}>
      <TextField
        id="outlined-basic"
        label={t('email')}
        variant="outlined"
        sx={{ width: '100%' }}
        type="email"
        value={userTmpEmail}
        onChange={(e) => setUserTmpEmail(e.target.value)}
        inputProps={{ readOnly: isOAuthAccountUpgrade && userTmpEmail.length > 0 }}
      />

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Link component="button" underline="none" variant="body1" onClick={handleProviderSignIn}>
          {t('authProvider')}
        </Link>
        <Button
          variant="contained"
          disabled={isProcessing}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
          onClick={handleSendLink}
        >
          {t('sendLink')}
        </Button>
      </Box>
    </Box>
  );
};

export default EmailAuth;
