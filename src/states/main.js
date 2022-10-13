import { atom } from 'recoil';

export const isLightThemeState = atom({
	key: 'isLightTheme',
	default: localStorage.getItem('theme') === 'dark' ? false : true || true,
});
