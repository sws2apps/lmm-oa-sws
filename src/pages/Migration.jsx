import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Stepper from '@mui/material/Stepper';
import MigrationStart from '../features/migration/MigrationStart';
import AccountVersionChooser from '../features/migration/AccountVersionChooser';
import UserAccountUpgrade from '../features/migration/UserAccountUpgrade';
import EmailLinkAuthentication from '../features/migration/EmailLinkAuthentication';
import SignIn from '../features/migration/SignIn';
import EmailAuth from '../features/migration/EmailAuth';
import VerifyMFA from '../features/migration/VerifyMFA';
import CongregationBackup from '../features/migration/CongregationBackup';
import MigrationCompleted from '../features/migration/MigrationCompleted';
import { apiSendAuthorization } from '../api/auth';
import { isAuthProcessingState, isEmailAuthState } from '../states/main';

const Migration = () => {
  const { t } = useTranslation('ui');

  const [searchParams] = useSearchParams();
  const isEmailLink = searchParams.get('code') !== null;

  const setIsAuthProcessing = useSetRecoilState(isAuthProcessingState);

  const isEmailAuth = useRecoilValue(isEmailAuthState);

  const [activeStep, setActiveStep] = useState(0);
  const [accountVersion, setAccountVersion] = useState('v2');

  useEffect(() => {
    if (isEmailLink) {
      setActiveStep(2);
    }
  }, [isEmailLink]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (activeStep === 2 && !isEmailLink) {
          setIsAuthProcessing(true);
          const result = await apiSendAuthorization();
          setIsAuthProcessing(false);
          if (!result.isVerifyMFA) {
            return;
          }

          setActiveStep(3);
        }
      }
    });
  }, [activeStep, isEmailLink, setIsAuthProcessing]);

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>{t('cpeMigrationStart')}</StepLabel>
          <StepContent>
            <MigrationStart setActiveStep={(value) => setActiveStep(value)} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{t('cpeAccountVersionCheck')}</StepLabel>
          <StepContent>
            <AccountVersionChooser
              accountVersion={accountVersion}
              setActiveStep={(value) => setActiveStep(value)}
              setAccountVersion={(value) => setAccountVersion(value)}
            />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{t('loginToAccount')}</StepLabel>
          <StepContent>
            {!isEmailLink && accountVersion === 'v1' && (
              <UserAccountUpgrade
                setActiveStep={(value) => setActiveStep(value)}
                setAccountVersion={(value) => setAccountVersion(value)}
              />
            )}
            {!isEmailLink && !isEmailAuth && accountVersion === 'v2' && (
              <SignIn setActiveStep={(value) => setActiveStep(value)} />
            )}
            {!isEmailLink && isEmailAuth && <EmailAuth setAccountVersion={(value) => setAccountVersion(value)} />}
            {isEmailLink && (
              <EmailLinkAuthentication
                setActiveStep={(value) => setActiveStep(value)}
                setAccountVersion={(value) => setAccountVersion(value)}
              />
            )}
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{t('mfaVerifyTitle')}</StepLabel>
          <StepContent>
            <VerifyMFA setActiveStep={(value) => setActiveStep(value)} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{t('sendBackup')}</StepLabel>
          <StepContent>
            <CongregationBackup setActiveStep={(value) => setActiveStep(value)} />
          </StepContent>
        </Step>
        <Step>
          <StepLabel>{t('cpeMigrationCompleted')}</StepLabel>
          <StepContent>
            <MigrationCompleted />
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default Migration;
