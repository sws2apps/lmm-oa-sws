import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import About from '../features/about';
import RootModal from './RootModal';
import UserAutoLogin from '../features/userAutoLogin';
import { BackupDbDialog, RestoreDbDialog } from '../features/backupRestore';
import { WhatsNew } from '../features/whatsNew';
import {
  backupDbOpenState,
  isAboutOpenState,
  isAppLoadState,
  isWhatsNewOpenState,
  restoreDbOpenState,
} from '../states/main';
import Startup from '../features/startup';
import NavBar from './NavBar';
import { fetchNotifications } from '../utils/app';
import { dlgAssDeleteOpenState, dlgAutoFillOpenState, isPublishOpenState } from '../states/schedule';
import { AutofillSchedule, DeleteSchedule, SchedulePublish } from '../features/schedules/';
import { isImportEPUBState, isImportJWOrgState } from '../states/sourceMaterial';
import { ImportEPUB, ImportJWOrg } from '../features/sourceMaterial/';

const Layout = () => {
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isOpenWhatsNew = useRecoilValue(isWhatsNewOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);
  const isBackupDb = useRecoilValue(backupDbOpenState);
  const isDeleteAssignment = useRecoilValue(dlgAssDeleteOpenState);
  const isAutofillAssignment = useRecoilValue(dlgAutoFillOpenState);
  const isPublishPocket = useRecoilValue(isPublishOpenState);
  const isImportEPUB = useRecoilValue(isImportEPUBState);
  const isImportJWOrg = useRecoilValue(isImportJWOrgState);

  useEffect(() => {
    const fetchNotif = async () => {
      setTimeout(async () => {
        await fetchNotifications();
        fetchNotif();
      }, 60000);
    };

    fetchNotif();
  }, []);

  return (
    <RootModal>
      <NavBar />
      <Box sx={{ padding: '20px' }}>
        <UserAutoLogin />

        {isOpenAbout && <About />}
        {isOpenWhatsNew && <WhatsNew />}
        {isRestoreDb && <RestoreDbDialog />}
        {isBackupDb && <BackupDbDialog />}
        {isDeleteAssignment && <DeleteSchedule />}
        {isAutofillAssignment && <AutofillSchedule />}
        {isPublishPocket && <SchedulePublish />}
        {isImportEPUB && <ImportEPUB />}
        {isImportJWOrg && <ImportJWOrg />}

        {isAppLoad && <Startup />}
        {!isAppLoad && <Outlet />}
      </Box>
    </RootModal>
  );
};

export default Layout;
