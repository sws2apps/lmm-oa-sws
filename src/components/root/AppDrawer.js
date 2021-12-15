import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useTranslation } from 'react-i18next';

const AppDrawer = () => {
    const { t } = useTranslation()
    return ( 
        <div>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.home")} />
                </ListItem>
                <ListItem button component={Link} to="/Students">
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.students")} />
                </ListItem>
                <ListItem button component={Link} to="/Schedule">
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.schedule")} />
                </ListItem>
                <ListItem button component={Link} to="/SourceMaterial">
                    <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.sourceMaterial")} />
                </ListItem>
                <ListItem button component={Link} to="/Settings">
                    <ListItemIcon><SettingsIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.settings")} />
                </ListItem>
                <ListItem button component={Link} to="/Help">
                    <ListItemIcon><HelpIcon /></ListItemIcon>
                    <ListItemText primary={t("nav.help")} />
                </ListItem>
            </List>
        </div>
    );
}
 
export default AppDrawer;