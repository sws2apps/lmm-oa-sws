import { lazy, Suspense, useState } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import usePwa2 from 'use-pwa2/dist/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppNotification from './components/root/AppNotification';
import Layout from './components/root/Layout';
import ServiceWorkerWrapper from './components/root/ServiceWorkerWrapper';
import Startup from './pages/Startup';
// import DBRestore from './pages/DBRestore';
// import Help from './pages/Help';
// import Home from './pages/Home';
// import ImportEPUB from './pages/ImportEPUB';
// import Schedule from './pages/Schedule';
// import Settings from './pages/Settings';
// import SourceMaterial from './pages/SourceMaterial';
// import Students from './pages/Students';
// import ScheduleTemplate from './template/ScheduleTemplate';

const DBRestore = lazy(() => import('./pages/DBRestore'));
const Help = lazy(() => import('./pages/Help'));
const Home = lazy(() => import('./pages/Home'));
const ImportEPUB = lazy(() => import('./pages/ImportEPUB'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Settings = lazy(() => import('./pages/Settings'));
const SourceMaterial = lazy(() => import('./pages/SourceMaterial'));
const Students = lazy(() => import('./pages/Students'));
const ScheduleTemplate = lazy(() => import('./template/ScheduleTemplate'));

const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        xs420: 420,
        sm: 600,
        sm800: 800,
        md: 900,
        lg: 1280,
        xl: 1536,
      },
    },
});

const App = () => {
    const [isAppLoad, setIsAppLoad] = useState(true);
    const [appSeverity, setAppSeverity] = useState("success");
    const [appMessage, setAppMessage] = useState("");
    const [appSnackOpen, setAppSnackOpen] = useState(false);
    const { enabledInstall, installPwa, isLoading, updatePwa } = usePwa2();
    
    if (!indexedDB) {
        if ('serviceWorker' in navigator) {}
        else {
            return (
                <div className="browser-not-supported">Tsy afaka mampiasa ny LMM-OA ianao amin’ity programa fijerenao internet ity. Hamarino raha mila fanavaozana ilay izy, na andramo amin’ny programa fijerena internet hafa.</div>
            )
        }
    }

    return ( 
        <ThemeProvider theme={theme}>
            <ServiceWorkerWrapper
                updatePwa={updatePwa}
            />
            {isAppLoad && (
                <Startup
                    setIsAppLoad={(value) => setIsAppLoad(value)}
                />
            )}
            {!isAppLoad && (
                <>
                    {appSnackOpen && (
                        <AppNotification
                            appSeverity={appSeverity}
                            appMessage={appMessage}
                            appSnackOpen={appSnackOpen}
                            setOpen={(value) => setAppSnackOpen(value)}
                        />
                    )}
                    <Suspense fallback={<div></div>}>
                        <HashRouter>
                            <Layout
                                enabledInstall={enabledInstall}
                                isLoading={isLoading}
                                installPwa={installPwa}
                            >
                                <Route exact path="/">
                                    <Home />
                                </Route>
                                <Route 
                                    path="/Students"
                                    render={(props) => (
                                        <Students 
                                            {...props}
                                            setAppSnackOpen={(value) => setAppSnackOpen(value)}
                                            setAppSeverity={(value) => setAppSeverity(value)}
                                            setAppMessage={(value) => setAppMessage(value)}
                                        />
                                    )}
                                />
                                <Route
                                    path="/Schedule"
                                    render={(props) => (
                                        <Schedule
                                            {...props}
                                            setAppSnackOpen={(value) => setAppSnackOpen(value)}
                                            setAppSeverity={(value) => setAppSeverity(value)}
                                            setAppMessage={(value) => setAppMessage(value)}
                                        />
                                    )}
                                />
                                <Route
                                    path="/ScheduleTemplate"
                                    render={(props) => (
                                        <ScheduleTemplate {...props} />
                                    )}
                                />
                                <Route 
                                    path="/SourceMaterial"
                                    render={(props) => (
                                        <SourceMaterial 
                                            {...props}
                                            setAppSnackOpen={(value) => setAppSnackOpen(value)}
                                            setAppSeverity={(value) => setAppSeverity(value)}
                                            setAppMessage={(value) => setAppMessage(value)}
                                        />
                                    )}
                                />
                                <Route
                                    path="/ImportEPUB"
                                    render={(props) => (
                                        <ImportEPUB
                                            {...props}
                                        />
                                    )}
                                />
                                <Route 
                                    path="/Settings"
                                    render={(props) => (
                                        <Settings 
                                            {...props}
                                            setAppSnackOpen={(value) => setAppSnackOpen(value)}
                                            setAppSeverity={(value) => setAppSeverity(value)}
                                            setAppMessage={(value) => setAppMessage(value)}
                                        />
                                    )}
                                />
                                <Route
                                    path="/DBRestore"
                                    render={(props) => (
                                        <DBRestore
                                            {...props}
                                        />
                                    )}
                                />
                                <Route path="/Help">
                                    <Help />
                                </Route>
                            </Layout>
                        </HashRouter>
                    </Suspense>
                </>
            )}
        </ThemeProvider>
    );
}
 
export default App;