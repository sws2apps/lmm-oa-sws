import { useEffect, useRef, useState } from 'react';
import { getAuth, indexedDBLocalPersistence, setPersistence, signInWithCustomToken } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiUpdatePasswordlessInfo } from '../../api/auth';
import {
  isEmailAuthState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const EmailLinkAuthentication = () => {
  const { t } = useTranslation('ui');

  const cancel = useRef();
  const nameRef = useRef();

  const setIsUserSignUp = useSetRecoilState(isUserSignUpState);
  const setIsUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsEmailAuth = useSetRecoilState(isEmailAuthState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);

  const [isProcessing, setIsProcessing] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const code = searchParams.get('code');
  const isNewUser = searchParams.get('user') === 'edit' ? false : true;

  const completeEmailAuth = async () => {
    const userFullname = nameRef?.current?.value;

    if (isNewUser && userFullname.length === 0) {
      setAppMessage(t('fullnameRequired'));
      setAppSeverity('warning');
      setAppSnackOpen(true);
      return;
    }

    setIsProcessing(true);
    const auth = getAuth();
    await setPersistence(auth, indexedDBLocalPersistence);
    const userCredential = await signInWithCustomToken(auth, code);
    const user = userCredential.user;

    cancel.current = false;

    const result = await apiUpdatePasswordlessInfo(user.uid, userFullname);
    // refetch auth after email update
    await signInWithCustomToken(auth, code);

    if (result.isVerifyMFA) {
      setIsProcessing(false);
      setUserMfaVerify(true);
      setSearchParams('');
      setIsUserSignUp(false);
      setIsUserSignIn(false);
    }
    if (result.isSetupMFA) {
      setUserMfaSetup(true);
      setSearchParams('');
      setIsUserSignUp(false);
      setIsUserSignIn(false);
    }
    setIsProcessing(false);
  };

  const handleRequestNewLink = () => {
    setSearchParams('');
    setIsUserSignUp(false);
    setIsUserSignIn(false);
    setIsEmailAuth(true);
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('emailAuth')}
      </Typography>

      <Box sx={{ maxWidth: '500px' }}>
        <Typography sx={{ marginBottom: '20px' }}>
          {isNewUser ? t('emailAuthDescWithNameComplete') : t('emailAuthDescNoNameComplete')}
        </Typography>

        {isNewUser && (
          <TextField
            id="outlined-basic"
            label={t('fullname')}
            variant="outlined"
            sx={{ width: '100%' }}
            type="email"
            inputRef={nameRef}
          />
        )}

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
          <Link component="button" underline="none" variant="body1" onClick={handleRequestNewLink}>
            {t('resendEmailLink')}
          </Link>
          <Button
            variant="contained"
            disabled={isProcessing}
            endIcon={isProcessing ? <CircularProgress size={25} /> : null}
            onClick={completeEmailAuth}
          >
            {t('signIn')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EmailLinkAuthentication;
