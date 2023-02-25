import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { apiHostState, visitorIDState } from '../../states/main';
import { congIDState } from '../../states/congregation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { getAuth } from 'firebase/auth';
import { dbExportDataOnline } from '../../indexedDb/dbUtility';

const CongregationBackup = ({ setActiveStep }) => {
  const { t } = useTranslation('ui');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const visitorID = useRecoilValue(visitorIDState);
  const apiHost = useRecoilValue(apiHostState);
  const congID = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackStep = () => {
    setActiveStep(1);
  };

  const handleSendBackup = async () => {
    try {
      if (apiHost !== '') {
        setIsProcessing(true);

        const auth = await getAuth();
        const user = auth.currentUser;

        const { dbPersons, dbDeleted, dbSourceMaterial, dbSchedule, dbPocketTbl, dbSettings } =
          await dbExportDataOnline();

        const reqPayload = {
          cong_persons: dbPersons,
          cong_deleted: dbDeleted,
          cong_schedule: dbSchedule,
          cong_sourceMaterial: dbSourceMaterial,
          cong_swsPocket: dbPocketTbl,
          cong_settings: dbSettings,
        };

        const res = await fetch(`${apiHost}api/congregations/${congID}/backup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify(reqPayload),
        });

        const data = await res.json();

        if (res.status !== 200) {
          setAppMessage(data.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
          setIsProcessing(false);

          return;
        }

        setAppMessage(t('backupSuccess'));
        setAppSeverity('success');
        setAppSnackOpen(true);
        setIsProcessing(false);
        setActiveStep(5);
      }
    } catch (err) {
      setIsProcessing(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Box>
      <Typography>{t('cpeSendBackupDesc')}</Typography>
      <Box sx={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <Button variant="contained" onClick={handleBackStep}>
          {t('previous')}
        </Button>
        <Button
          onClick={handleSendBackup}
          variant="contained"
          disabled={isProcessing || visitorID.length === 0}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          {t('send')}
        </Button>
      </Box>
    </Box>
  );
};

export default CongregationBackup;
