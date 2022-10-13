import { selector } from 'recoil';
import { isLightThemeState } from './main';

export const themeOptionsState = selector({
	key: 'themeOptions',
	get: ({ get }) => {
		const isLight = get(isLightThemeState);

		return {
			navBar: '#3f51b5 !important',
            textNotImportant: isLight ? '#707B7C' : '#D0D3D4',
		};
	},
});
