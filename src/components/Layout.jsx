import { useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import usePwa2 from 'use-pwa2/dist/index.js';
import Box from '@mui/material/Box';
import RootModal from './RootModal';
import NavBar from './NavBar';
import WaitingPage from './WaitingPage';
import { AppUpdater } from '../features/updater';
import { isOnlineState } from '../states/main';

const Layout = ({ updatePwa }) => {
  let location = useLocation();

  const { enabledInstall, installPwa, isLoading } = usePwa2();

  const isOnline = useRecoilValue(isOnlineState);

  const checkPwaUpdate = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((reg) => {
        reg.update();
      });
    }
  };

  useEffect(() => {
    if (import.meta.env.PROD && isOnline) checkPwaUpdate();
  }, [isOnline, location]);

  return (
    <RootModal>
      <NavBar enabledInstall={enabledInstall} isLoading={isLoading} installPwa={installPwa} />
      <AppUpdater updatePwa={updatePwa} enabledInstall={enabledInstall} />

      <Box sx={{ padding: '10px' }}>
        <Suspense fallback={<WaitingPage />}>
          <Outlet />
        </Suspense>
      </Box>
    </RootModal>
  );
};

export default Layout;
