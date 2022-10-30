import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { themeOptionsState } from '../states/theme';

const MenuCard = ({ title, links }) => {
  const theme = useRecoilValue(themeOptionsState);
console.log(theme)
  return (
    <Box sx={{ width: '350px' }}>
      <Box sx={{ padding: '10px', backgroundColor: theme.navBar, borderRadius: '10px 10px 0 0' }}>
        <Typography textAlign="center" sx={{ color: 'white', fontSize: '20px' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ border: '1px solid', padding: '10px', height: '260px', maxHeight: '260px', overflow: 'auto', borderTop: 'none' }}>
        <List>
          {links.map((link, index) => (
            <ListItem key={`menu-child-${index}`} disablePadding>
              <ListItemButton>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MenuCard;
