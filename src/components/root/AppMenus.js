import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../index";
import styled from "@emotion/styled";
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import GetApp from '@mui/icons-material/GetApp';
import AppDrawer from "./AppDrawer";
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
const drawerWidth = 240;

const AppMenus = (props) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appBarTitle, setAppBarTitle] = useState("Fandraisana");
  const { enabledInstall, isLoading, installPwa } = props;

  useEffect(() => {
    if (location.pathname === "/") {
      setAppBarTitle("Fandraisana");
    } else if (location.pathname === "/Students") {
      setAppBarTitle("Mpianatra");
    } else if (location.pathname === "/Schedule") {
      setAppBarTitle("Fandaharana");
    } else if (location.pathname === "/SourceMaterial") {
      setAppBarTitle("Loharanon-kevitra");
    } else if (location.pathname === "/Settings") {
      setAppBarTitle("Fanamboarana");
    } else if (location.pathname === "/Help") {
      setAppBarTitle("Fanampiana");
    };
    serviceWorkerRegistration.update();
  }, [location.pathname])

  const handleInstallPwa = () => {
    installPwa();
    logEvent(analytics, 'pwa_install_lmm_oa');
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleAbout = () => {
    props.openAbout(true);
  }

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: '50px !important',
          minHeight: '50px !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Toolbar
          sx={{
            height: '50px !important',
            minHeight: '50px !important',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              '@media screen and (max-width: 959px)': {
                fontSize: 0,
                marginRight: '2px',
                display: 'block',
              },
              '@media screen and (min-width: 960px)': {
                display: 'none',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Box sx={{display: "flex"}}>
              <Box
                sx={{
                  '@media screen and (max-width: 959px)': {
                    display: 'none',
                  },
                  '@media screen and (min-width: 960px)': {
                    marginRight: '3px',
                    display: 'block',
                  },
                }}
              >
                LMM-OA |
              </Box>
              {appBarTitle}
            </Box>
          </Typography>
        </Toolbar>
        <div>
          {(!isLoading && enabledInstall) && (
            <IconButton
              color="inherit"
              edge="start"
              sx={{marginRight: '8px'}}
              onClick={() => handleInstallPwa()}
            >
              <GetApp />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => handleAbout()}
          >
            <InfoIcon />
          </IconButton>
        </div>
      </AppBar>
      
      <Box
        component="nav"
        sx={{
          '@media screen and (min-width: 960px)': {
            width: drawerWidth,
            flexShrink: 0,
          },
        }}
      >
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onClick={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            '@media screen and (max-width: 959px)': {
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              display: 'block',
            },
            '@media screen and (min-width: 960px)': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              backgroundColor: '#3f51b5',
              height: 50,
            }}
          >
            LMM-OA
          </Typography>
          <AppDrawer />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            '@media screen and (min-width: 960px)': {
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              display: 'block',
            },
            '@media screen and (max-width: 959px)': {
              display: 'none',
            },
          }}
        >
          <Offset />
          <AppDrawer />
        </Drawer>  
      </Box>
    </Box>
  );
}
 
export default AppMenus;