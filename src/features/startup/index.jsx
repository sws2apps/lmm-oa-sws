import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import EmailNotVerified from './EmailNotVerified';
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel';
import SetupMFA from './SetupMFA';
import SignIn from './SignIn';
import SignUp from './SignUp';
import UnauthorizedRole from './UnauthorizedRole';
import VerifyMFA from './VerifyMFA';
import EmailAuth from './EmailAuth';
import EmailBlocked from './EmailBlocked';
import CongregationCreate from './CongregationCreate';
import TermsUse from './TermsUse';
import { dbGetAppSettings } from '../../indexedDb/dbAppSettings';
import { loadApp } from '../../utils/app';
import { runUpdater } from '../../utils/updater';
import {
  isAppLoadState,
  isAuthProcessingState,
  isCongAccountCreateState,
  isEmailAuthState,
  isEmailBlockedState,
  isEmailNotVerifiedState,
  isSetupState,
  isShowTermsUseState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  startupProgressState,
  visitorIDState,
} from '../../states/main';
import { apiSendAuthorization } from '../../api/auth';

const Startup = () => {
  const cancel = useRef();

  const { isAuthenticated } = useFirebaseAuth();

  const [isSetup, setIsSetup] = useRecoilState(isSetupState);
  const [startupProgress, setStartupProgress] = useRecoilState(startupProgressState);
  const [showTermsUse, setShowTermsUse] = useRecoilState(isShowTermsUseState);
  const [isUserSignUp, setIsUserSignUp] = useRecoilState(isUserSignUpState);
  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);
  const [isUserMfaVerify, setUserMfaVerify] = useRecoilState(isUserMfaVerifyState);
  const [isUserMfaSetup, setUserMfaSetup] = useRecoilState(isUserMfaSetupState);
  const [isCongAccountCreate, setIsCongAccountCreate] = useRecoilState(isCongAccountCreateState);

  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setIsAuthProcessing = useSetRecoilState(isAuthProcessingState);

  const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isEmailBlocked = useRecoilValue(isEmailBlockedState);
  const isEmailAuth = useRecoilValue(isEmailAuthState);
  const visitorID = useRecoilValue(visitorIDState);

  useEffect(() => {
    const checkLoginState = async () => {
      let { isLoggedOut, userPass, username } = await dbGetAppSettings();

      if (isLoggedOut === false && userPass?.length > 0 && username?.length > 0) {
        await loadApp();
        await runUpdater();
        setTimeout(() => {
          setIsAppLoad(false);
          setStartupProgress(0);
        }, [1000]);
      } else if (isLoggedOut === true) {
        setShowTermsUse(false);
        setIsUserSignUp(false);
        setIsUserSignIn(true);
        setIsSetup(true);
      } else {
        setIsSetup(true);
      }
    };

    checkLoginState();
  }, [setIsAppLoad, setIsSetup, setStartupProgress, setShowTermsUse, setIsUserSignUp, setIsUserSignIn]);

  useEffect(() => {
    const handleNextAuth = async () => {
      cancel.current = false;

      setIsAuthProcessing(true);
      const result = await apiSendAuthorization();

      if (result.isVerifyMFA) {
        setUserMfaVerify(true);
      }
      if (result.isSetupMFA) {
        setUserMfaSetup(true);
      }
      setIsUserSignUp(false);
      setIsUserSignIn(false);
      setIsCongAccountCreate(false);
      setIsAuthProcessing(false);
    };

    if (isAuthenticated) {
      handleNextAuth();
    }
  }, [
    isAuthenticated,
    setIsAuthProcessing,
    setIsCongAccountCreate,
    setIsUserSignIn,
    setIsUserSignUp,
    setUserMfaSetup,
    setUserMfaVerify,
    visitorID,
  ]);

  if (isSetup) {
    return (
      <>
        {showTermsUse && <TermsUse />}
        {!showTermsUse && (
          <>
            {isUserSignIn && <SignIn />}
            {isUserSignUp && <SignUp />}
            {isEmailNotVerified && <EmailNotVerified />}
            {isUserMfaSetup && <SetupMFA />}
            {isUnauthorizedRole && <UnauthorizedRole />}
            {isUserMfaVerify && <VerifyMFA />}
            {isEmailBlocked && <EmailBlocked />}
            {isCongAccountCreate && <CongregationCreate />}
            {isEmailAuth && <EmailAuth />}
          </>
        )}
      </>
    );
  }

  return (
    <Box className="app-splash-screen">
      <Box className="app-logo-container">
        <img src="/img/appLogo.png" alt="App logo" className="appLogo" />
      </Box>
      <Box sx={{ width: '280px', marginTop: '10px' }}>
        <LinearProgressWithLabel value={startupProgress} />
      </Box>
    </Box>
  );
};

export default Startup;
