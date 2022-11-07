import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { yearsListState } from '../states/sourceMaterial';

const Schedules = () => {
  const { t } = useTranslation()
  const yearsList = useRecoilValue(yearsListState)

  console.log(yearsList)
  
  return (
    <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
      {t('dashboard.schedule')}
    </Typography>
  );
};

export default Schedules;
