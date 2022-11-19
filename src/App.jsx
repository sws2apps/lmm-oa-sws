import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import { apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { InternetChecker } from './features/internetChecker';
import { appSnackOpenState } from './states/notification';
import NotificationWrapper from './features/notificationWrapper';
import Administration from './pages/Administration';
import DashboardMenu from './pages/DashboardMenu';
import Layout from './components/Layout';
import Persons from './pages/Persons';
import PersonDetails from './pages/PersonDetails';
import PrivateRoot from './components/PrivateRoot';
import Schedules from './pages/Schedules';
import ScheduleDetails from './pages/ScheduleDetails';
import S89 from './pages/S89';
import S140 from './pages/S140';
import ScheduleWeekDetails from './pages/ScheduleWeekDetails';
import Settings from './pages/Settings';
import SourceMaterials from './pages/SourceMaterials';
import SourceWeekDetails from './pages/SourceWeekDetails';
import VipUserDetail from './pages/VipUserDetail';
import { isAdminCongState } from './states/congregation';

// creating theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isOnline = useRecoilValue(isOnlineState);
  const isLight = useRecoilValue(isLightThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);
  const isAdminCong = useRecoilValue(isAdminCongState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '/', element: <DashboardMenu /> },
        { path: '/persons', element: <Persons /> },
        { path: '/persons/new', element: <PersonDetails /> },
        { path: '/persons/:id', element: <PersonDetails /> },
        { path: '/schedules', element: <Schedules /> },
        { path: '/schedules/:schedule', element: <ScheduleDetails /> },
        { path: '/schedules/:schedule/:weekToFormat', element: <ScheduleWeekDetails /> },
        { path: '/assignment-form', element: <S89 /> },
        { path: '/midweek-meeting-schedule', element: <S140 /> },
        { path: '/source-materials', element: <SourceMaterials /> },
        { path: '/source-materials/:weekToFormat', element: <SourceWeekDetails /> },
        { path: '/settings', element: <Settings /> },
        {
          element: <PrivateRoot isAdminCong={isAdminCong} />,
          children: [
            {
              path: '/administration',
              element: <Administration />,
            },
            {
              path: '/administration/members/new',
              element: <VipUserDetail />,
            },
            {
              path: '/administration/members/:id',
              element: <VipUserDetail />,
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    if (isLight) {
      setActiveTheme(lightTheme);
    } else {
      setActiveTheme(darkTheme);
    }
  }, [isLight]);

  useEffect(() => {
    // get visitor ID and check if there is an active connection
    const getUserID = async () => {
      const fpPromise = FingerprintJS.load({
        apiKey: 'XwmESck7zm6PZAfspXbs',
      });

      let visitorId = '';

      do {
        const fp = await fpPromise;
        const result = await fp.get();
        visitorId = result.visitorId;
      } while (visitorId.length === 0);

      setVisitorID(visitorId);
    };

    if (isOnline) {
      getUserID();
    }
  }, [setVisitorID, isOnline]);

  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        setApiHost(import.meta.env.VITE_API_REMOTE_URL);
      } else {
        setApiHost('http://localhost:8000/');
      }
    } else {
      setApiHost('https://sws2apps-api.onrender.com/');
    }
  }, [setApiHost]);

  useEffect(() => {
    if (!indexedDB) {
      if ('serviceWorker' in navigator) {
      } else {
        return (
          <div className="browser-not-supported">
            You seem to use an unsupported browser to use LMM-OA. Make sure that you browser is up to date, or try to
            use another browser.
          </div>
        );
      }
    }
  }, []);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <InternetChecker />
      {appSnackOpen && <NotificationWrapper />}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
