import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { dbCountAssignmentsInfo } from '../../indexedDb/dbSchedule';

const WeekSummaryItem = ({ week }) => {
  const { t } = useTranslation();

  const [assInfo, setAssInfo] = useState({ total: 0, assigned: 0 });
  const [progress, setProgress] = useState(0);

  const getAssignmentsInfo = useCallback(async () => {
    const data = await dbCountAssignmentsInfo(week.value);
    const vPg = (data.assigned * 100) / data.total;
    setAssInfo(data);
    setProgress(vPg);
  }, [week]);

  useEffect(() => {
    getAssignmentsInfo();
  }, [getAssignmentsInfo]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '30px',
        borderBottom: '1px outset',
        paddingBottom: '20px',
        maxWidth: '1200px',
      }}
    >
      <Box>
        <Typography variant="caption">{t('global.week')}</Typography>
        <Typography variant="h6">{week.label}</Typography>
      </Box>
      <Box>
        <Typography variant="caption">{t('schedule.assignedParts')}</Typography>
        <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'space-between' }}>
          <LinearProgress color="success" variant="determinate" value={progress} sx={{ width: '90px' }} />
          <Typography sx={{ fontWeight: 'bold' }}>{`${assInfo.assigned}/${assInfo.total}`}</Typography>
        </Box>
      </Box>
      {assInfo.total > 0 && (
        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<EditIcon color="success" />}>
            {t('global.edit')}
          </Button>
          <Button variant="outlined" startIcon={<FlashAutoIcon color="secondary" />}>
            {t('schedule.autofill')}
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon color="error" />}>
            {t('global.delete')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default WeekSummaryItem;
