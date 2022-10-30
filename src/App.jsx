import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import Startup from './features/startup';
import { apiHostState, isAppLoadState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { InternetChecker } from './features/internetChecker';
import { appSnackOpenState } from './states/notification';
import NotificationWrapper from './features/notificationWrapper';
import UserAutoLogin from './features/userAutoLogin/UserAutoLogin';
import DashboardMenu from './pages/DashboardMenu';

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

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardMenu />,
  },
]);

const App = () => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isOnline = useRecoilValue(isOnlineState);
  const isLight = useRecoilValue(isLightThemeState);
  const isAppLoad = useRecoilValue(isAppLoadState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);

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
      setApiHost('http://localhost:8000/');
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
      <NavBar />
      <InternetChecker />
      <UserAutoLogin />
      {appSnackOpen && <NotificationWrapper />}
      {isAppLoad && <Startup />}
      {!isAppLoad && <RouterProvider router={router} />}
    </ThemeProvider>
  );
};

export default App;
