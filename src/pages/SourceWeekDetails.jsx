import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dateFormat from 'dateformat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PartDuration, PartType, WeekType } from '../features/sourceMaterial';
import { isRerenderSourceState } from '../states/sourceMaterial';
import { appLangState, shortDateFormatState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { dbGetSourceMaterial, dbSaveSrcData } from '../indexedDb/dbSourceMaterial';

const sharedStyles = {
  ayfStuPart: {
    padding: '10px',
    marginBottom: '15px',
    boxShadow: '0 8px rgba(0, 0, 255, 0.2)',
  },
  ayfStuPartInfo: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  inputAYF: {
    width: '100%',
  },
  partHeader: {
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

const SourceWeekDetails = () => {
  const { weekToFormat } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const appLang = useRecoilValue(appLangState);
  const isRerender = useRecoilValue(isRerenderSourceState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const [weekOf, setWeekOf] = useState('');
  const [hasMeeting, setHasMeeting] = useState(true);
  const [weekType, setWeekType] = useState(1);
  const [BRead, setBRead] = useState('');
  const [Ass1Type, setAss1Type] = useState('');
  const [Ass1Time, setAss1Time] = useState('');
  const [Ass1Src, setAss1Src] = useState('');
  const [Ass2Type, setAss2Type] = useState('');
  const [Ass2Time, setAss2Time] = useState('');
  const [Ass2Src, setAss2Src] = useState('');
  const [Ass3Type, setAss3Type] = useState('');
  const [Ass3Time, setAss3Time] = useState('');
  const [Ass3Src, setAss3Src] = useState('');
  const [Ass4Type, setAss4Type] = useState('');
  const [Ass4Time, setAss4Time] = useState('');
  const [Ass4Src, setAss4Src] = useState('');

  const week = weekToFormat.replaceAll('-', '/');
  const weekFormatted = dateFormat(new Date(week), shortDateFormat);

  const handleNavigateSource = () => {
    navigate(`/source-materials`);
  };

  const handleSaveSource = async () => {
    const obj = {};
    obj.weekOf = weekOf;
    obj.bibleReading_src = BRead;
    obj.ass1_type = Ass1Type;
    obj.ass1_time = Ass1Time;
    obj.ass1_src = Ass1Src;
    obj.ass2_type = Ass2Type;
    obj.ass2_time = Ass2Time;
    obj.ass2_src = Ass2Src;
    obj.ass3_type = Ass3Type;
    obj.ass3_time = Ass3Time;
    obj.ass3_src = Ass3Src;
    obj.ass4_type = Ass4Type;
    obj.ass4_time = Ass4Time;
    obj.ass4_src = Ass4Src;
    obj.week_type = weekType;
    obj.noMeeting = !hasMeeting;
    obj.isOverride = true;

    const isSaved = await dbSaveSrcData(obj);

    if (isSaved === true) {
      setAppSnackOpen(true);
      setAppSeverity('success');
      setAppMessage(t('sourceMaterial.weekSaved'));
    } else {
      setAppSnackOpen(true);
      setAppSeverity('error');
      setAppMessage(t('sourceMaterial.saveError'));
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const loadWeekData = async () => {
      const data = await dbGetSourceMaterial(week);
      if (isSubscribed) {
        setWeekOf(data.weekOf);
        setHasMeeting(!data.noMeeting);
        setWeekType(data.week_type);
        setBRead(data.bibleReading_src);
        setAss1Time(data.ass1_time);
        setAss1Type(data.ass1_type);
        setAss1Src(data.ass1_src);
        setAss2Time(data.ass2_time);
        setAss2Type(data.ass2_type);
        setAss2Src(data.ass2_src);
        setAss3Time(data.ass3_time);
        setAss3Type(data.ass3_type);
        setAss3Src(data.ass3_src);
        setAss4Time(data.ass4_time);
        setAss4Type(data.ass4_type);
        setAss4Src(data.ass4_src);
      }
    };

    if (week !== '' && isSubscribed) {
      loadWeekData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [appLang, isRerender, week]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton onClick={handleNavigateSource}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
          {`${t('global.sourceMaterial')} > ${weekFormatted}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '50px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <WeekType
            weekType={weekType}
            setWeekType={(value) => setWeekType(value)}
            setHasMeeting={(value) => setHasMeeting(value)}
          />
          <FormControlLabel
            control={<Switch checked={hasMeeting} onChange={(e) => setHasMeeting(e.target.checked)} />}
            label={hasMeeting ? t('sourceMaterial.hasMeeting') : t('sourceMaterial.noMeeting')}
          />
        </Box>
        <Box className={`tgwPart meetingPart`}>
          <Typography variant="h6">{t('global.treasuresPart')}</Typography>
        </Box>
        <TextField
          id="outlined-basic"
          label={t('global.bibleReadingText')}
          variant="outlined"
          size="small"
          sx={{
            marginTop: '8px',
            width: '300px',
          }}
          value={BRead}
          onChange={(e) => setBRead(e.target.value)}
        />
        <Box className={`ayfPart meetingPart`}>
          <Typography variant="h6">{t('global.applyFieldMinistryPart')}</Typography>
        </Box>
        <Box sx={sharedStyles.ayfStuPart}>
          <Typography variant="body1" sx={sharedStyles.partHeader}>
            {t('global.ayfPart1')}
          </Typography>
          <Box sx={sharedStyles.ayfStuPartInfo}>
            <PartDuration ayf={1} assTime={Ass1Time} setAss1Time={(value) => setAss1Time(value)} />
            <PartType ayf={1} assType={Ass1Type} setAss1Type={(value) => setAss1Type(value)} />
            <TextField
              id="outlined-basic"
              label={t('global.sourceMaterial')}
              variant="outlined"
              multiline
              size="small"
              sx={sharedStyles.inputAYF}
              value={Ass1Src}
              onChange={(e) => setAss1Src(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={sharedStyles.ayfStuPart}>
          <Typography variant="body1" sx={sharedStyles.partHeader}>
            {t('global.ayfPart2')}
          </Typography>
          <Box sx={sharedStyles.ayfStuPartInfo}>
            <PartDuration ayf={2} assTime={Ass2Time} setAss2Time={(value) => setAss2Time(value)} />
            <PartType ayf={2} assType={Ass2Type} setAss2Type={(value) => setAss2Type(value)} />
            <TextField
              id="outlined-basic"
              label={t('global.sourceMaterial')}
              variant="outlined"
              multiline
              size="small"
              sx={sharedStyles.inputAYF}
              value={Ass2Src}
              onChange={(e) => setAss2Src(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={sharedStyles.ayfStuPart}>
          <Typography variant="body1" sx={sharedStyles.partHeader}>
            {t('global.ayfPart3')}
          </Typography>
          <Box sx={sharedStyles.ayfStuPartInfo}>
            <PartDuration ayf={3} assTime={Ass3Time} setAss3Time={(value) => setAss3Time(value)} />
            <PartType ayf={3} assType={Ass3Type} setAss3Type={(value) => setAss3Type(value)} />
            <TextField
              id="outlined-basic"
              label={t('global.sourceMaterial')}
              variant="outlined"
              multiline
              size="small"
              sx={sharedStyles.inputAYF}
              value={Ass3Src}
              onChange={(e) => setAss3Src(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={sharedStyles.ayfStuPart}>
          <Typography variant="body1" sx={sharedStyles.partHeader}>
            {t('global.ayfPart4')}
          </Typography>
          <Box sx={sharedStyles.ayfStuPartInfo}>
            <PartDuration ayf={4} assTime={Ass4Time} setAss4Time={(value) => setAss4Time(value)} />
            <PartType ayf={4} assType={Ass4Type} setAss4Type={(value) => setAss4Type(value)} />
            <TextField
              id="outlined-basic"
              label={t('global.sourceMaterial')}
              variant="outlined"
              multiline
              size="small"
              sx={sharedStyles.inputAYF}
              value={Ass4Src}
              onChange={(e) => setAss4Src(e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleSaveSource}>
          <SaveIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default SourceWeekDetails;
