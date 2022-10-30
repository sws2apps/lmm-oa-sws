import { cloneElement, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppLanguage from '../features/languageSwitcher';
import ThemeSwitcher from '../features/themeSwitcher';
import WhatsNewContent from '../features/whatsNew';
import { themeOptionsState } from '../states/theme';
import { countNotificationsState } from '../states/main';
import { congAccountConnectedState, congInfoFormattedState, usernameState } from '../states/congregation';

const sharedStyles = {
  menuIcon: {
    borderRadius: '8px',
    '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
      borderRadius: 0,
      backgroundColor: 'rgba(23, 32, 42, .3)',
    },
  },
};

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
  const { enabledInstall, isLoading, installPwa } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);
  const cnNews = useRecoilValue(countNotificationsState);
  const congInfo = useRecoilValue(congInfoFormattedState);
  const username = useRecoilValue(usernameState);
  const congAccountConnected = useRecoilValue(congAccountConnectedState);

  const mdUp = useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorPopoverEl, setAnchorPopoverEl] = useState(null);

  const open = Boolean(anchorEl);
  const openPopover = Boolean(anchorPopoverEl);
  const id = openPopover ? 'notification-popover' : undefined;

  const handleWhatsNewClick = (event) => {
    setAnchorPopoverEl(event.currentTarget);
  };

  const handleWhatsNewClose = () => {
    setAnchorPopoverEl(null);
  };

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: themeOptions.navBar,
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
                }}
              />
              <Typography noWrap sx={{ fontSize: '18px' }}>
                {mdUp ? 'Life and Ministry Meeting Overseer Assistant' : 'LMM-OA'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <AppLanguage />

              {!isLoading && enabledInstall && (
                <IconButton color="inherit" edge="start" sx={sharedStyles.menuIcon} onClick={() => installPwa()}>
                  <GetApp />
                  {mdUp && <Typography sx={{ marginLeft: '5px' }}>{t('global.install')}</Typography>}
                </IconButton>
              )}

              <IconButton
                color="inherit"
                edge="start"
                sx={sharedStyles.menuIcon}
                aria-describedby={id}
                onClick={handleWhatsNewClick}
              >
                <Badge badgeContent={cnNews} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <WhatsNewContent
                id={id}
                open={openPopover}
                anchorEl={anchorPopoverEl}
                handleClose={handleWhatsNewClose}
              />

              <ThemeSwitcher />

              {congAccountConnected && (
                <IconButton
                  color="inherit"
                  edge="start"
                  sx={sharedStyles.menuIcon}
                  onClick={handleMenu}
                  id="button-account"
                  aria-controls={open ? 'menu-account' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  {mdUp && (
                    <Box sx={{ marginRight: '5px' }}>
                      <Typography
                        sx={{
                          marginLeft: '5px',
                          textAlign: 'right',
                          fontSize: '12px',
                        }}
                      >
                        {username}
                      </Typography>
                      <Typography
                        sx={{
                          marginLeft: '5px',
                          textAlign: 'right',
                          fontSize: '12px',
                        }}
                      >
                        {congInfo}
                      </Typography>
                    </Box>
                  )}
                  <AccountCircle sx={{ fontSize: '40px' }} />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </>
  );
};

export default NavBar;
