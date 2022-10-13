import { cloneElement } from 'react';
import { useRecoilValue } from 'recoil';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import ThemeSwitcher from './ThemeSwitcher';
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
	const themeOptions = useRecoilValue(themeOptionsState);

	return (
		<>
			<CssBaseline />
			<ElevationScroll {...props}>
				<AppBar
					position='fixed'
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
								src='./img/appLogo.png'
								alt='App Logo'
								style={{
									width: 'auto',
									height: '50px',
									borderRadius: '4px',
									marginRight: '5px',
								}}
							/>
							<Typography noWrap sx={{ fontSize: '18px' }}>
								Secretary Tools - Report Organizer
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
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