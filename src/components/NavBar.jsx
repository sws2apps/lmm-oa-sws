import { cloneElement } from 'react';
import { useRecoilValue } from 'recoil';
import { useTheme } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppLanguage from '../features/languageSwitcher';
import ThemeSwitcher from '../features/themeSwitcher';
import { themeOptionsState } from '../states/theme';

const ElevationScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
};

const NavBar = (props) => {
  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  const lgUp = useMediaQuery(theme.breakpoints.up('lg'), {
    noSsr: true,
  });

  return (
    <>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: themeOptions.mainColor,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: '50px !important',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Toolbar
            sx={{
              height: '50px !important',
              paddingLeft: '0px !important',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '40px',
              }}
            >
              <img
                src="./img/appLogo.png"
                alt="App Logo"
                style={{
                  width: 'auto',
                  height: '50px',
                  borderRadius: '4px',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
              />
              <Typography noWrap sx={{ fontSize: '18px' }}>
                {lgUp ? 'Congregation Program for Everyone' : 'CPE App'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <AppLanguage />

              <ThemeSwitcher />
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
};

export default NavBar;
