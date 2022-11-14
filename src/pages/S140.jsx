import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Typography from '@mui/material/Typography';
import { monthNamesState, rootModalOpenState } from '../states/main';
import { currentScheduleState } from '../states/schedule';
import { classCountState, congNameState, congNumberState } from '../states/congregation';
import { dbGetScheduleForPrint } from '../indexedDb/dbAssignment';

const S140 = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();

  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const currentSchedule = useRecoilValue(currentScheduleState);
  const classCount = useRecoilValue(classCountState);
  const congName = useRecoilValue(congNameState);
  const congNumber = useRecoilValue(congNumberState);
  const monthNames = useRecoilValue(monthNamesState);

  const [data, setData] = useState([]);
  const [month, setMonth] = useState('');

  const savePDF = () => {
    const element = document.getElementById('schedule_template');
    var opt = {
      margin: [0.2, 0.5, 0.2, 0.5],
      filename: `${currentSchedule.value.replace('/', '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    const getData = async () => {
      setRootModalOpen(true);
      const month = currentSchedule.value.split('/')[0];

      const monthName = monthNames[+month - 1];
      setMonth(monthName);

      const data = await dbGetScheduleForPrint(currentSchedule.value);
      setData(data);
      setRootModalOpen(false);
    };

    if (currentSchedule === '' || currentSchedule.value?.length === '') {
      navigate('/schedules');
    } else {
      getData();
    }
  }, [navigate, currentSchedule, monthNames, setRootModalOpen]);

  return (
    <>
      {data.length > 0 && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveAltIcon />}
            sx={{ margin: '0 2px 20px 0' }}
            onClick={savePDF}
          >
            PDF
          </Button>
          <Box
            sx={{
              width: '800px',
              overflow: 'auto',
              padding: '20px',
              backgroundColor: 'white',
            }}
          >
            <Box id="schedule_template">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderBottom: '3px solid black',
                  paddingBottom: '2px',
                  marginBottom: '20px',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: 'black',
                  }}
                >
                  {congName !== '' && congNumber !== '' ? `${congName.toUpperCase()} (${congNumber})` : ''}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '19px',
                    color: 'black',
                  }}
                >
                  {t('scheduleTemplate.studentsAssignment')}
                </Typography>
              </Box>
              {data.map((weekItem) => {
                const dateV = weekItem.week.split('/')[1] + ' ' + month.toUpperCase();

                return (
                  <Box key={weekItem.week} sx={{ marginBottom: '15px' }}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: 'black',
                        marginBottom: '5px',
                      }}
                    >
                      {dateV}
                    </Typography>
                    {weekItem.scheduleData.noMeeting && (
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: 'darkblue',
                          fontSize: '13px',
                          width: '360px',
                          lineHeight: '20px',
                        }}
                      >
                        {t('sourceMaterial.noMeeting')}
                      </Typography>
                    )}
                    {weekItem.scheduleData.week_type !== 1 && (
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: 'darkblue',
                          fontSize: '13px',
                          width: '360px',
                          lineHeight: '20px',
                          marginBottom: '5px',
                        }}
                      >
                        {weekItem.scheduleData.week_type_name.toUpperCase()}
                      </Typography>
                    )}
                    {!weekItem.scheduleData.noMeeting && weekItem.scheduleData.week_type !== 3 && (
                      <>
                        <Box sx={{ display: 'flex' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '0 0 0 6px',
                              backgroundColor: '#656164',
                              width: '360px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.treasuresPart')}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'gray',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {classCount === 1 ? '' : t('global.auxClass')}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'gray',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.mainHall')}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            marginBottom: '5px',
                          }}
                        >
                          <Box
                            sx={{
                              width: '360px',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box
                              sx={{
                                lineHeight: '20px',
                              }}
                            >
                              <ul className="ulSchedule">
                                <li className="tgw">
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      color: 'black',
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    {t('global.bibleReading')}
                                    <span className="student-part-duration">{t('global.bibleReadingTime')}</span>
                                  </Typography>
                                </li>
                              </ul>
                            </Box>
                            <Typography
                              sx={{
                                color: 'gray',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                padding: '0 0 0 8px',
                                lineHeight: '20px',
                              }}
                            >
                              {t('global.student')}:
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              color: 'black',
                              fontSize: '12px',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {classCount === 1 ? '' : weekItem.scheduleData.bRead_stu_B_dispName}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'black',
                              fontSize: '12px',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {weekItem.scheduleData.bRead_stu_A_dispName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '0 0 0 6px',
                              backgroundColor: '#a56803',
                              width: '360px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.applyFieldMinistryPart')}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'gray',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {classCount === 1 ? '' : t('global.auxClass')}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'gray',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '0 0 0 8px',
                              width: '180px',
                              lineHeight: '20px',
                            }}
                          >
                            {t('global.mainHall')}
                          </Typography>
                        </Box>
                        {[1, 2, 3, 4].map((index) => {
                          const fldTypeName = 'ass' + index + '_type_name';
                          const fldType = 'ass' + index + '_type';
                          const fldTime = 'ass' + index + '_time';
                          const fldSrc = 'ass' + index + '_src';
                          const fldStuA = 'ass' + index + '_stu_A_dispName';
                          const fldAssA = 'ass' + index + '_ass_A_dispName';
                          const fldStuB = 'ass' + index + '_stu_B_dispName';
                          const fldAssB = 'ass' + index + '_ass_B_dispName';

                          return (
                            <Box key={index}>
                              {weekItem.sourceData[fldType] !== '' && (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    marginBottom: '2px',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: '360px',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        lineHeight: '20px',
                                      }}
                                    >
                                      <ul className="ulSchedule">
                                        <li className="ayf">
                                          <Typography
                                            sx={{
                                              fontSize: '13px',
                                              color: 'black',
                                              lineHeight: 1.3,
                                            }}
                                          >
                                            {weekItem.sourceData[fldType] === 107
                                              ? weekItem.sourceData[fldSrc]
                                              : weekItem.sourceData[fldTypeName]}
                                            <span className="student-part-duration">
                                              {(weekItem.sourceData[fldType] === 105 ||
                                                weekItem.sourceData[fldType] === 106 ||
                                                weekItem.sourceData[fldType] === 107) && (
                                                <>({weekItem.sourceData[fldTime]} min.)</>
                                              )}
                                              {(weekItem.sourceData[fldType] === 101 ||
                                                weekItem.sourceData[fldType] === 102 ||
                                                weekItem.sourceData[fldType] === 103 ||
                                                weekItem.sourceData[fldType] === 104) && (
                                                <>
                                                  (
                                                  {t('global.partLessTime', {
                                                    duration: weekItem.sourceData[fldTime],
                                                  })}
                                                  )
                                                </>
                                              )}
                                            </span>
                                          </Typography>
                                        </li>
                                      </ul>
                                    </Box>
                                    {(weekItem.sourceData[fldType] === 101 ||
                                      weekItem.sourceData[fldType] === 102 ||
                                      weekItem.sourceData[fldType] === 103) && (
                                      <Typography
                                        sx={{
                                          color: 'gray',
                                          fontSize: '9px',
                                          fontWeight: 'bold',
                                          padding: '0 0 0 8px',
                                          lineHeight: '20px',
                                        }}
                                      >
                                        {t('scheduleTemplate.studentAssistant')}
                                      </Typography>
                                    )}
                                    {weekItem.sourceData[fldType] === 104 && (
                                      <Typography
                                        sx={{
                                          color: 'gray',
                                          fontSize: '9px',
                                          fontWeight: 'bold',
                                          padding: '0 0 0 8px',
                                          lineHeight: '20px',
                                        }}
                                      >
                                        {t('global.student')}:
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    sx={{
                                      color: 'black',
                                      fontSize: '12px',
                                      padding: '0 0 0 8px',
                                      width: '180px',
                                      lineHeight: '20px',
                                    }}
                                  >
                                    {classCount === 2 && (
                                      <>
                                        {(weekItem.sourceData[fldType] === 101 ||
                                          weekItem.sourceData[fldType] === 102 ||
                                          weekItem.sourceData[fldType] === 103 ||
                                          weekItem.sourceData[fldType] === 104) && (
                                          <>
                                            {weekItem.scheduleData[fldStuB]}
                                            {weekItem.scheduleData[fldAssB] === ''
                                              ? ''
                                              : `/${weekItem.scheduleData[fldAssB]}`}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: 'black',
                                      fontSize: '12px',
                                      padding: '0 0 0 8px',
                                      width: '180px',
                                      lineHeight: '20px',
                                    }}
                                  >
                                    <>
                                      {(weekItem.sourceData[fldType] === 101 ||
                                        weekItem.sourceData[fldType] === 102 ||
                                        weekItem.sourceData[fldType] === 103 ||
                                        weekItem.sourceData[fldType] === 104) && (
                                        <>
                                          {weekItem.scheduleData[fldStuA]}
                                          {weekItem.scheduleData[fldAssA] === ''
                                            ? ''
                                            : `/${weekItem.scheduleData[fldAssA]}`}
                                        </>
                                      )}
                                    </>
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default S140;
