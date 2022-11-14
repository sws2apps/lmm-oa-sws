import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {
  currentScheduleState,
  currentWeekSchedState,
  dlgAssDeleteOpenState,
  isDeleteSchedState,
  reloadWeekSummaryState,
} from '../../states/schedule';
import { dbGetWeekListBySched } from '../../indexedDb/dbSourceMaterial';
import { dbCountAssignmentsInfo, dbGetScheduleData } from '../../indexedDb/dbSchedule';
import { dbSaveAss } from '../../indexedDb/dbAssignment';

const DeleteSchedule = () => {
  const { t } = useTranslation();

  const [dlgAssDeleteOpen, setDlgAssDeleteOpen] = useRecoilState(dlgAssDeleteOpenState);

  const setReloadWeekSummary = useSetRecoilState(reloadWeekSummaryState);

  const isDeleteSched = useRecoilValue(isDeleteSchedState);
  const currentSchedule = useRecoilValue(currentScheduleState);
  const currentWeek = useRecoilValue(currentWeekSchedState);

  const [totalToDelete, setTotalToDelete] = useState(0);
  const [deleted, setDeleted] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [weeks, setWeeks] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setDlgAssDeleteOpen(false);
  };

  const fetchInfoToDelete = useCallback(async () => {
    const newData = [];

    if (isDeleteSched) {
      let data = await dbGetWeekListBySched(currentSchedule.value);
      for (let i = 0; i < data.length; i++) {
        const obj = {};
        obj.value = data[i].weekOf;
        newData.push(obj);
      }
    } else {
      newData.push({ value: currentWeek.value });
    }

    setWeeks(newData);

    let cn = 0;
    for (let i = 0; i < newData.length; i++) {
      const week = newData[i].value;
      const { assigned } = await dbCountAssignmentsInfo(week);
      cn = cn + assigned;
    }

    setTotalToDelete(cn);
  }, [currentSchedule, currentWeek, isDeleteSched]);

  const handleDeleteSchedule = async () => {
    setIsDeleting(true);

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i].value;

      const schedData = await dbGetScheduleData(week);

      // bible reading
      if (schedData.bRead_stu_A !== '') {
        await dbSaveAss(week, undefined, 'bRead_stu_A');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      if (schedData.bRead_stu_B !== '') {
        await dbSaveAss(week, undefined, 'bRead_stu_B');
        setDeleted((prev) => {
          return prev + 1;
        });
      }

      // field ministry
      for (let a = 1; a < 5; a++) {
        const stuFieldA = `ass${a}_stu_A`;
        const assFieldA = `ass${a}_ass_A`;
        const stuFieldB = `ass${a}_stu_B`;
        const assFieldB = `ass${a}_ass_B`;

        if (schedData[stuFieldA] !== '') {
          await dbSaveAss(week, undefined, stuFieldA);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[assFieldA] !== '') {
          await dbSaveAss(week, undefined, assFieldA);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[stuFieldB] !== '') {
          await dbSaveAss(week, undefined, stuFieldB);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
        if (schedData[assFieldB] !== '') {
          await dbSaveAss(week, undefined, assFieldB);
          setDeleted((prev) => {
            return prev + 1;
          });
        }
      }
    }

    setReloadWeekSummary((prev) => {
      return !prev;
    });

    setTimeout(() => {
      setIsDeleting(false);
      setDlgAssDeleteOpen(false);
    }, [1000]);
  };

  useEffect(() => {
    fetchInfoToDelete();
  }, [fetchInfoToDelete]);

  useEffect(() => {
    const vPg = (deleted * 100) / totalToDelete;
    setProgress(vPg);
  }, [deleted, totalToDelete]);

  return (
    <Box>
      <Dialog open={dlgAssDeleteOpen} aria-labelledby="dialog-title-delete-assignment" onClose={handleClose}>
        <DialogTitle id="dialog-title-delete-assignment">
          <Typography variant="h6" component="p">
            {t('schedule.deleteAssignmentTitle')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isDeleteSched && (
            <Typography>
              {t('schedule.deleteScheduleConfirm', {
                currentSchedule: currentSchedule.label,
              })}
            </Typography>
          )}
          {!isDeleteSched && (
            <Typography>
              {t('schedule.deleteWeekConfirm', {
                currentWeek: currentWeek.label,
              })}
            </Typography>
          )}

          {isDeleting && (
            <Box
              sx={{
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}
            >
              <LinearProgress color="success" variant="determinate" value={progress} sx={{ width: '100%' }} />
              <Typography sx={{ fontWeight: 'bold', marginLeft: '25px' }}>{`${deleted}/${totalToDelete}`}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus disabled={isDeleting}>
            {t('global.no')}
          </Button>
          <Button autoFocus onClick={handleDeleteSchedule} color="primary" disabled={isDeleting}>
            {t('global.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteSchedule;
