import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import About from './About';
import AppMenus from './AppMenus';

const Layout = (props) => {
    const [appBarTitle, setAppBarTitle] = useState("LMM-OA");
    const [openAbout, setOpenAbout] = useState(false);
    const { enabledInstall, isLoading, installPwa } = props;

    useEffect(() => {
       setAppBarTitle(props.appBarTitle);
    }, [props.appBarTitle])

    return ( 
        <Box sx={{display: 'flex'}}>
            {openAbout && (
                <About
                    isAboutOpen={openAbout}
                    openAbout={(value) => setOpenAbout(value)}
                />
            )}
            <AppMenus 
                appBarTitle={appBarTitle}
                openAbout={(value) => setOpenAbout(value)}
                enabledInstall={enabledInstall}
                isLoading={isLoading}
                installPwa={installPwa}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    paddingTop: '60px',
                    paddingLeft: '5px',
                }}
            >
                {props.children}
            </Box>
        </Box>
     );
}
 
export default Layout;