import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppInProgress from './pages/AppInProgress';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import { isLightThemeState } from './states/main';

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
	const isLight = useRecoilValue(isLightThemeState);

	const [activeTheme, setActiveTheme] = useState(darkTheme);

	useEffect(() => {
		if (isLight) {
			setActiveTheme(lightTheme);
		} else {
			setActiveTheme(darkTheme);
		}
	}, [isLight]);

	return (
		<ThemeProvider theme={activeTheme}>
			<CssBaseline />
			<NavBar />
			<AppInProgress />
		</ThemeProvider>
	);
};

export default App;