import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import About from '../features/about';
import RootModal from './RootModal';
import UserAutoLogin from '../features/userAutoLogin';
import { RestoreDbDialog } from '../features/backupRestore';
import { WhatsNew } from '../features/whatsNew';
import { isAboutOpenState, isAppLoadState, isWhatsNewOpenState, restoreDbOpenState } from '../states/main';
import Startup from '../features/startup';
import NavBar from './NavBar';
import { fetchNotifications } from '../utils/app';

const Layout = () => {
  const isAppLoad = useRecoilValue(isAppLoadState);
  const isOpenAbout = useRecoilValue(isAboutOpenState);
  const isOpenWhatsNew = useRecoilValue(isWhatsNewOpenState);
  const isRestoreDb = useRecoilValue(restoreDbOpenState);

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

        {isAppLoad && <Startup />}
        {!isAppLoad && <Outlet />}
      </Box>
    </RootModal>
  );
};

export default Layout;
