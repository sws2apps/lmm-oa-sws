import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import About from './About';
import AppMenus from './AppMenus';
import BackupDbDialog from '../settings/BackupDbDialog';
import Login from './Login';
import RootModal from './RootModal';
import WhatsNew from './WhatsNew';
import {
	backupDbOpenState,
	isAboutOpenState,
	isLoginOpenState,
	isWhatsNewOpenState,
} from '../../appStates/appSettings';

const Layout = (props) => {
	const { enabledInstall, isLoading, installPwa } = props;

	const isOpenAbout = useRecoilValue(isAboutOpenState);
	const isOpenLogin = useRecoilValue(isLoginOpenState);
	const isOpenWhatsNew = useRecoilValue(isWhatsNewOpenState);
	const isBackupDb = useRecoilValue(backupDbOpenState);

	return (
		<RootModal>
			<Box sx={{ display: 'flex' }}>
				{isOpenAbout && <About />}
				{isBackupDb && <BackupDbDialog />}
				{isOpenLogin && <Login />}
				{isOpenWhatsNew && <WhatsNew />}

				<AppMenus
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
		</RootModal>
	);
};

export default Layout;
