import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import PrintIcon from '@mui/icons-material/Print';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import { currentScheduleState, dlgAssDeleteOpenState, isDeleteSchedState } from '../../states/schedule';

const ScheduleCard = ({ schedule }) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const setDlgAssDeleteOpen = useSetRecoilState(dlgAssDeleteOpenState);
  const setIsDeleteSched = useSetRecoilState(isDeleteSchedState);
  const setCurrentSchedule = useSetRecoilState(currentScheduleState);

  const [anchorPrintEl, setAnchorPrintEl] = useState(null);

  const openPrint = Boolean(anchorPrintEl);

  const handleMenuPrint = (e) => {
    setAnchorPrintEl(e.currentTarget);
  };

  const handleClosePrint = () => {
    setAnchorPrintEl(null);
  };

  const handleOpenSchedule = () => {
    navigate(`/schedules/${schedule.value.replace('/', '-')}`);
  };

  const handleDeleteSchedule = () => {
    setCurrentSchedule(schedule);
    setIsDeleteSched(true);
    setDlgAssDeleteOpen(true);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: '15px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="h6" sx={{ minWidth: '180px' }}>
        {schedule.label}
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <IconButton onClick={handleOpenSchedule}>
          <OpenInNewIcon color="success" sx={{ fontSize: '35px' }} />
        </IconButton>
        <IconButton>
          <FlashAutoIcon color="secondary" sx={{ fontSize: '35px' }} />
        </IconButton>
        <IconButton
          id="button-print"
          onClick={handleMenuPrint}
          aria-controls={openPrint ? 'menu-print' : undefined}
          aria-haspopup="true"
          aria-expanded={openPrint ? 'true' : undefined}
        >
          <PrintIcon sx={{ fontSize: '35px' }} />
        </IconButton>

        <Menu
          sx={{ marginTop: '50px' }}
          id="menu-print"
          MenuListProps={{
            'aria-labelledby': 'button-print',
          }}
          anchorEl={anchorPrintEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={openPrint}
          onClose={handleClosePrint}
        >
          <MenuItem>
            <ListItemText primary={t('schedule.s89')} />
          </MenuItem>
          <MenuItem>
            <ListItemText primary={t('schedule.midweekMeetingPrint')} />
          </MenuItem>
        </Menu>

        <IconButton>
          <SendIcon color="info" sx={{ fontSize: '35px' }} />
        </IconButton>
        <IconButton onClick={handleDeleteSchedule}>
          <DeleteIcon color="error" sx={{ fontSize: '35px' }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ScheduleCard;
