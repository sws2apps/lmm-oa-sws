import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuCard from '../components/MenuCard';
import { isAdminCongState } from '../states/congregation';
import { isOnlineState } from '../states/main';

const DashboardMenu = () => {
  const { t } = useTranslation();

  const isAdminCong = useRecoilValue(isAdminCongState);
  const isOnline = useRecoilValue(isOnlineState);

  const dashboardMenus = [
    {
      title: t('dashboard.persons'),
      visible: true,
      links: [
        {
          title: t('dashboard.persons'),
          icon: <PeopleIcon />,
          disabled: false,
          navigateTo: '/persons',
        },
        {
          title: t('dashboard.personAdd'),
          icon: <PersonAddIcon />,
          disabled: false,
          navigateTo: '/persons/new',
        },
      ],
    },
    {
      title: t('dashboard.schedule'),
      visible: true,
      links: [
        {
          title: t('dashboard.viewAssignmentsSchedule'),
          icon: <AssignmentIcon />,
          disabled: false,
          navigateTo: '/schedules',
        },
      ],
    },
    {
      title: t('dashboard.sourceMaterial'),
      visible: true,
      links: [
        {
          title: t('dashboard.viewSourceMaterial'),
          icon: <CalendarMonthIcon />,
          disabled: false,
        },
        {
          title: t('dashboard.weekAddNew'),
          icon: <MoreTimeIcon />,
          disabled: false,
        },
        {
          title: t('dashboard.sourceImportEPUB'),
          icon: <FileCopyIcon />,
          disabled: false,
        },
        {
          title: t('dashboard.sourceImportJw'),
          icon: <CloudSyncIcon />,
          disabled: isOnline ? false : true,
        },
      ],
    },
    {
      title: t('dashboard.administration'),
      visible: isAdminCong ? true : false,
      links: [
        {
          title: t('dashboard.manageAccessToApps'),
          icon: <AccountCircleIcon />,
          disabled: false,
        },
        {
          title: t('dashboard.addNewAppointed'),
          icon: <PersonAddIcon />,
          disabled: false,
        },
      ],
    },
  ];

  return (
    <Box sx={{ padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {dashboardMenus.map((menu, index) => (
        <MenuCard key={`menu-item-${index}`} menu={menu} />
      ))}
    </Box>
  );
};

export default DashboardMenu;
