import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getI18n, useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import TranslateIcon from '@mui/icons-material/Translate';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { appLangState } from '../../appStates/appSettings';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { isDbExist } from '../../indexedDb/dbUtility';
import { langList } from '../../locales/langList';

const AppLanguage = (props) => {
	const { t, i18n } = useTranslation();
	const { isStartup } = props;

	const [anchorEl, setAnchorEl] = useState(null);

	const [appLang, setAppLang] = useRecoilState(appLangState);
	const [appLangLocal, setAppLangLocal] = useState(appLang);

	const blueColor = blue[400];

	let isMenuOpen = Boolean(anchorEl);

	const handleLangChange = async (e) => {
		const app_lang = e.target.parentElement.dataset.code;
		setAppLangLocal(app_lang);
		handleClose();
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		const updateLang = async () => {
			await i18n.changeLanguage(appLangLocal);

			const isoLang =
				getI18n().getDataByLanguage(appLangLocal).translation['global.iso'];
			document.documentElement.setAttribute('lang', isoLang);

			setAppLang(appLangLocal);

			const isExist = await isDbExist('lmm_oa');

			if (isExist) {
				await dbUpdateAppSettings({
					app_lang: appLangLocal,
				});
			} else {
				localStorage.setItem('app_lang', appLangLocal);
			}
		};

		updateLang();
	}, [appLangLocal, i18n, setAppLang]);

	return (
		<>
			<Tooltip title={t('global.changeLanguage')}>
				<IconButton
					color='inherit'
					edge='start'
					sx={{
						marginRight: '8px',
						backgroundColor: isStartup ? blueColor : null,
					}}
					onClick={handleClick}
				>
					<TranslateIcon />
				</IconButton>
			</Tooltip>
			<Menu
				id='menu-language'
				disableScrollLock={true}
				anchorEl={anchorEl}
				open={isMenuOpen}
				onClose={handleClose}
				sx={{ padding: 0 }}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{langList.map((lang) => (
					<MenuItem
						key={lang.code}
						onClick={handleLangChange}
						sx={{ padding: 0 }}
					>
						<ListItemText data-code={lang.code}>
							<Typography sx={{ padding: '6px 16px' }}>{lang.name}</Typography>
						</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default AppLanguage;
