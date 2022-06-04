import { Link } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useTranslation } from 'react-i18next';

const AppDrawer = () => {
	const { t } = useTranslation();
	return (
		<div>
			<List>
				<ListItem button component={Link} to='/'>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.home')} />
				</ListItem>
				<ListItem button component={Link} to='/students'>
					<ListItemIcon>
						<PeopleIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.students')} />
				</ListItem>
				<ListItem button component={Link} to='/schedule'>
					<ListItemIcon>
						<ScheduleIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.schedule')} />
				</ListItem>
				<ListItem button component={Link} to='/source-material'>
					<ListItemIcon>
						<LibraryBooksIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.sourceMaterial')} />
				</ListItem>
				<ListItem button component={Link} to='/settings'>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.settings')} />
				</ListItem>
				<ListItem button component={Link} to='/administration'>
					<ListItemIcon>
						<AdminPanelSettingsIcon />
					</ListItemIcon>
					<ListItemText primary={t('global.administration')} />
				</ListItem>
			</List>
		</div>
	);
};

export default AppDrawer;
