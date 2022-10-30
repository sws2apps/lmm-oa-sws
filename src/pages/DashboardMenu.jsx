import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuCard from '../components/MenuCard';

const dashboardMenus = [
  {
    title: 'Persons',
    links: [
      {
        title: 'Persons',
        icon: <PeopleIcon />
      },
      {
        title: 'Add New Person',
        icon: <PersonAddIcon />
      }
    ],
  },
  {
    title: 'Schedule',
    links: [
      {
        title: 'View Assignments Schedule',
        icon: <PeopleIcon />
      },
      {
        title: 'Add New Person',
        icon: <PersonAddIcon />
      }
    ],
  },
];

const DashboardMenu = () => {
  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu, index) => (
        <MenuCard key={`menu-item-${index}`} title={menu.title} links={menu.links} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
