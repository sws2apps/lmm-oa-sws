import { useEffect, useRef, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TogglePassword from './TogglePassword';
import UserEmailField from './UserEmailField';
import UserPasswordField from './UserPasswordField';
import { isEmailAuthState, isOAuthAccountUpgradeState, isOnlineState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { isEmailValid } from '../../utils/emailValid';
import OAuth from './OAuth';
import EmailAuth from './EmailAuth';

const UserAccountUpgrade = ({ setActiveStep, setAccountVersion }) => {
  const cancel = useRef();

  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsOAuthAccountUpgrade = useSetRecoilState(isOAuthAccountUpgradeState);

  const visitorID = useRecoilValue(visitorIDState);
  const isOnline = useRecoilValue(isOnlineState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);

  const [userTmpEmail, setUserTmpEmail] = useState('');
  const [userTmpPwd, setUserTmpPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPwd, setHasErrorPwd] = useState(false);

  const handleEmailChange = (value) => {
    value = value.toLowerCase();
    setUserTmpEmail(value);
  };

  const togglePwd = () => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  const handleAuthSignIn = async () => {
    try {
      cancel.current = false;
      setHasErrorEmail(false);
      setHasErrorPwd(false);
      if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
        setIsProcessing(true);
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, userTmpEmail, userTmpPwd);
        setIsProcessing(false);
        setIsOAuthAccountUpgrade(true);
        setIsLogin(false);
      } else {
        if (!isEmailValid(userTmpEmail)) {
          setHasErrorEmail(true);
        }
        if (userTmpPwd.length < 10) {
          setHasErrorPwd(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(t('incorrectInfo'));
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleBackStep = () => {
    setActiveStep(1);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
      setIsOAuthAccountUpgrade(true);
    });
  }, [setIsOAuthAccountUpgrade]);

  return (
    <Box sx={{ marginTop: '20px' }}>
      {isLogin && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Typography>{t('userAccountUpgradeDesc')}</Typography>
            <Typography>{t('userAccountUpgradeStart')}</Typography>
          </Box>

          <Box sx={{ maxWidth: '380px' }}>
            <UserEmailField
              userEmail={userTmpEmail}
              setUserEmail={(value) => handleEmailChange(value)}
              hasErrorEmail={hasErrorEmail}
            />
            <UserPasswordField
              userPwd={userTmpPwd}
              setUserPwd={(value) => setUserTmpPwd(value)}
              showPwd={showPwd}
              label={t('password')}
              hasErrorPwd={hasErrorPwd}
            />
            <TogglePassword showPwd={showPwd} togglePwd={togglePwd} />
            <Box sx={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="contained" onClick={handleBackStep}>
                {t('previous')}
              </Button>
              <Button
                variant="contained"
                disabled={!isOnline || isProcessing || visitorID.length === 0}
                endIcon={isProcessing ? <CircularProgress size={25} /> : null}
                onClick={handleAuthSignIn}
              >
                {t('signIn')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {!isLogin && !isEmailAuth && (
        <Box>
          <Typography sx={{ marginBottom: '15px' }}>{t('userAccountUpgradeChooseService')}</Typography>
          <OAuth />
          <Button variant="contained" sx={{ marginTop: '15px' }} onClick={handleBackStep}>
            {t('previous')}
          </Button>
        </Box>
      )}

      {!isLogin && isEmailAuth && <EmailAuth setAccountVersion={(value) => setAccountVersion(value)} />}
    </Box>
  );
};

export default UserAccountUpgrade;
