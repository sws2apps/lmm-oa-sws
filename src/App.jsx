import { useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import CssBaseline from '@mui/material/CssBaseline';
import { apiHostState, isLightThemeState, isOnlineState, visitorIDState } from './states/main';
import { appSnackOpenState } from './states/notification';
import NotificationWrapper from './features/notificationWrapper';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Migration from './pages/Migration';

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

const queryClient = new QueryClient();

const App = ({ updatePwa }) => {
  const setVisitorID = useSetRecoilState(visitorIDState);
  const setApiHost = useSetRecoilState(apiHostState);

  const isOnline = useRecoilValue(isOnlineState);
  const isLight = useRecoilValue(isLightThemeState);
  const appSnackOpen = useRecoilValue(appSnackOpenState);

  const [activeTheme, setActiveTheme] = useState(darkTheme);

  const router = createHashRouter([
    {
      element: <Layout updatePwa={updatePwa} />,
      errorElement: <ErrorBoundary />,
      children: [{ path: '/', element: <Migration /> }],
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
        apiKey: import.meta.env.VITE_FINGERPRINT_API_CLIENT_KEY,
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
    let apiHost;
    if (
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === 'development' ||
      window.location.host.indexOf('localhost') !== -1
    ) {
      if (import.meta.env.VITE_API_REMOTE_URL) {
        apiHost = import.meta.env.VITE_API_REMOTE_URL;
      } else {
        apiHost = 'http://localhost:8000/';
      }
    } else {
      apiHost = 'https://sws2apps.onrender.com/';
    }

    setApiHost(apiHost);
  }, [setApiHost]);

  useEffect(() => {
    if (!indexedDB) {
      if (!('serviceWorker' in navigator)) {
        return (
          <div className="browser-not-supported">
            You seem to use an unsupported browser to use CPE. Make sure that you browser is up to date, or try to use
            another browser.
          </div>
        );
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />

        {appSnackOpen && <NotificationWrapper />}

        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
