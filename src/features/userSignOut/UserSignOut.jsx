import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  apiHostState,
  isAppClosingState,
  isAppLoadState,
  isCongAccountCreateState,
  isOnlineState,
  isSetupState,
  isShowTermsUseState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  isUserSignUpState,
  offlineOverrideState,
  visitorIDState,
} from '../../states/main';
import { congAccountConnectedState } from '../../states/congregation';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const UserSignOut = () => {
  const { t } = useTranslation('ui');

  const [open, setOpen] = useRecoilState(isAppClosingState);
  const [congAccountConnected, setCongAccountConnectedState] = useRecoilState(congAccountConnectedState);

  const setIsAppLoad = useSetRecoilState(isAppLoadState);
  const setIsSetup = useSetRecoilState(isSetupState);
  const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setUserSignUp = useSetRecoilState(isUserSignUpState);
  const setShowTermsUse = useSetRecoilState(isShowTermsUseState);
  const setOfflineOverrideState = useSetRecoilState(offlineOverrideState);
  const setIsCongAccountCreateState = useSetRecoilState(isCongAccountCreateState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const { user } = useFirebaseAuth();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const abortCont = new AbortController();

    const handleLogout = async () => {
      if (isOnline && congAccountConnected) {
        if (apiHost !== '') {
          await fetch(`${apiHost}api/users/logout`, {
            signal: abortCont.signal,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              visitorid: visitorID,
              uid: user.uid,
            },
          });

          setCongAccountConnectedState(false);
        }
      }

      localStorage.removeItem('email');
      await dbUpdateAppSettings({ isLoggedOut: true });

      setOpen(false);
      setOfflineOverrideState(false);
      setIsAppLoad(true);
      setIsSetup(true);
      setUserMfaSetup(false);
      setUserMfaVerify(false);
      setShowTermsUse(false);
      setUserSignUp(false);
      setIsCongAccountCreateState(false);
      setUserSignIn(true);
    };

    if (open) {
      handleLogout();
    }

    return () => {
      abortCont.abort();
    };
  }, [
    open,
    apiHost,
    congAccountConnected,
    isOnline,
    setCongAccountConnectedState,
    setIsAppLoad,
    setIsCongAccountCreateState,
    setIsSetup,
    setOfflineOverrideState,
    setOpen,
    setShowTermsUse,
    setUserMfaSetup,
    setUserMfaVerify,
    setUserSignIn,
    setUserSignUp,
    user,
    visitorID,
  ]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-close-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-close-title">{t('waitSignOut')}</DialogTitle>
        <DialogContent>
          <CircularProgress
            color="secondary"
            size={80}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '10px auto',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserSignOut;
