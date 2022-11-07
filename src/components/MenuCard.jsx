import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { themeOptionsState } from '../states/theme';

const MenuCard = ({ menu }) => {
  const theme = useRecoilValue(themeOptionsState);
  const navigate = useNavigate();

  const { title, links, visible } = menu;

  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <>
      {visible && (
        <Box sx={{ width: '350px' }}>
          <Box sx={{ padding: '10px', backgroundColor: theme.mainColor, borderRadius: '10px 10px 0 0' }}>
            <Typography textAlign="center" sx={{ color: 'white', fontSize: '20px' }}>
              {title}
            </Typography>
          </Box>
          <Box
            sx={{
              border: '1px solid',
              padding: '10px',
              height: '280px',
              maxHeight: '280px',
              overflow: 'auto',
              borderTop: 'none',
            }}
          >
            <List>
              {links.map((link, index) => (
                <ListItem key={`menu-child-${index}`} disablePadding disabled={link.disabled}>
                  <ListItemButton onClick={() => handleNavigate(link.navigateTo)}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MenuCard;
