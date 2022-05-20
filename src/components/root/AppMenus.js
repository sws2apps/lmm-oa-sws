import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import GetApp from '@mui/icons-material/GetApp';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppDrawer from './AppDrawer';
import AppLanguage from './AppLanguage';
import {
	appStageState,
	isAboutOpenState,
	isAppClosingState,
} from '../../appStates/appSettings';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
const drawerWidth = 240;

const sharedStyles = {
	menuIcon: {
		marginRight: '8px',
		borderRadius: '8px',
		'.MuiTouchRipple-ripple .MuiTouchRipple-child': {
			borderRadius: 0,
			backgroundColor: 'rgba(23, 32, 42, .3)',
		},
	},
};

const AppMenus = (props) => {
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [appBarTitle, setAppBarTitle] = useState('');
	const { enabledInstall, isLoading, installPwa } = props;

	const setIsAboutOpen = useSetRecoilState(isAboutOpenState);
	const setIsAppClosing = useSetRecoilState(isAppClosingState);

	const appStage = useRecoilValue(appStageState);

	const { t } = useTranslation();

	const theme = useTheme();
	const miniView = useMediaQuery(theme.breakpoints.down('sm'), {
		noSsr: true,
	});

	const largeView = useMediaQuery(theme.breakpoints.up('md'), {
		noSsr: true,
	});

	const handleInstallPwa = () => {
		installPwa();
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleAbout = () => {
		setIsAboutOpen(true);
	};

	const handleLogout = async () => {
		setIsAppClosing(true);
	};

	const checkPwaUpdate = () => {
		if ('serviceWorker' in navigator) {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
			navigator.serviceWorker.register(swUrl).then((reg) => {
				reg.update();
			});
		}
	};

	useEffect(() => {
		if (location.pathname === '/') {
			setAppBarTitle(t('global.home'));
		} else if (location.pathname === '/Students') {
			setAppBarTitle(t('global.students'));
		} else if (location.pathname === '/Schedule') {
			setAppBarTitle(t('global.schedule'));
		} else if (location.pathname === '/SourceMaterial') {
			setAppBarTitle(t('global.sourceMaterial'));
		} else if (location.pathname === '/Settings') {
			setAppBarTitle(t('global.settings'));
		} else if (location.pathname === '/Administration') {
			setAppBarTitle(t('global.administration'));
		}
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		} else {
			checkPwaUpdate();
		}
	}, [t, location.pathname]);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar
				position='fixed'
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
						color='inherit'
						aria-label='Open drawer'
						edge='start'
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
					<Box
						sx={{
							alignItems: 'center',
							'@media screen and (max-width: 959px)': {
								display: 'none',
							},
							'@media screen and (min-width: 960px)': {
								marginRight: '3px',
								display: 'flex',
							},
						}}
					>
						<img
							src='./img/appLogo.png'
							alt='App Logo'
							style={{
								width: 'auto',
								height: '40px',
							}}
						/>
						<Typography noWrap sx={{ marginLeft: '10px', fontSize: '18px' }}>
							LMM-OA |{' '}
						</Typography>
					</Box>
					<Typography noWrap sx={{ fontSize: '18px' }}>
						{appBarTitle}
					</Typography>
				</Toolbar>
				<Box
					sx={{
						minWidth: '30px',
						display: 'flex',
					}}
				>
					{appStage !== 'LIVE' && (
						<Typography
							sx={{
								display: 'flex',
								alignItems: 'center',
								marginTop: '8px',
								marginRight: '20px',
								backgroundColor: '#F5EEF8',
								padding: '2px 10px 2px 10px',
								height: '25px',
								color: '#EC7063',
								borderRadius: '5px',
								fontSize: '12px',
								fontWeight: 'bold',
							}}
						>
							{miniView ? appStage.substring(0, 1).toUpperCase() : appStage}
						</Typography>
					)}

					{!isLoading && enabledInstall && (
						<IconButton
							color='inherit'
							edge='start'
							sx={sharedStyles.menuIcon}
							onClick={() => handleInstallPwa()}
						>
							<GetApp />
							{largeView && (
								<Typography sx={{ marginLeft: '5px' }} variant='body1'>
									{t('global.install')}
								</Typography>
							)}
						</IconButton>
					)}
					<AppLanguage />

					<IconButton
						edge='start'
						color='inherit'
						sx={sharedStyles.menuIcon}
						onClick={() => handleAbout()}
					>
						<InfoIcon />
						{largeView && (
							<Typography sx={{ marginLeft: '5px' }} variant='body1'>
								{t('global.about')}
							</Typography>
						)}
					</IconButton>

					<IconButton
						color='inherit'
						edge='start'
						sx={sharedStyles.menuIcon}
						onClick={handleLogout}
					>
						<PowerSettingsNewIcon />
						{largeView && (
							<Typography sx={{ marginLeft: '5px' }} variant='body1'>
								{t('global.quit')}
							</Typography>
						)}
					</IconButton>
				</Box>
			</AppBar>

			<Box
				component='nav'
				sx={{
					'@media screen and (min-width: 960px)': {
						width: drawerWidth,
						flexShrink: 0,
					},
				}}
			>
				<Drawer
					variant='temporary'
					anchor='left'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					onClick={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						zIndex: (theme) => theme.zIndex.drawer + 2,
						'@media screen and (max-width: 959px)': {
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
							},
							display: 'block',
						},
						'@media screen and (min-width: 960px)': {
							display: 'none',
						},
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							backgroundColor: '#3f51b5',
							height: 50,
						}}
					>
						<img
							src='./img/appLogo.png'
							alt='App Logo'
							style={{
								width: 'auto',
								height: '40px',
							}}
						/>
						<Typography sx={{ marginLeft: '10px', fontSize: '18px' }}>
							LMM-OA
						</Typography>
					</Box>
					<AppDrawer />
				</Drawer>
				<Drawer
					variant='permanent'
					sx={{
						'@media screen and (min-width: 960px)': {
							'& .MuiDrawer-paper': {
								boxSizing: 'border-box',
								width: drawerWidth,
							},
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
};

export default AppMenus;
