import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import dateFormat from 'dateformat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import DevicesIcon from '@mui/icons-material/Devices';
import FormControlLabel from '@mui/material/FormControlLabel';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { rootModalOpenState, visitorIDState } from '../states/main';

const styles = {
  checkbox: {
    paddingTop: '0 !important',
  },
};

const CongregationPersonDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isFetchingPersons = useIsFetching({ queryKey: ['congPersons'] });
  const query = queryClient.getQueryData(['congPersons']);
  const person = query?.find((person) => person.id === id);

  const setModalOpen = useSetRecoilState(rootModalOpenState);

  const visitorID = useRecoilValue(visitorIDState);

  const [member, setMember] = useState(person);

  const handleCheckAdmin = (value) => {
    let role = [];
    if (value) {
      role = ['admin', ...member.cong_role];
    } else {
      role = member.cong_role.filter((role) => role !== 'admin');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMO = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'lmmo'];
    } else {
      role = member.cong_role.filter((role) => role !== 'lmmo');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMOAssistant = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'lmmo-backup'];
    } else {
      role = member.cong_role.filter((role) => role !== 'lmmo-backup');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckViewMeetingSchedule = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'view_meeting_schedule'];
    } else {
      role = member.cong_role.filter((role) => role !== 'view_meeting_schedule');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleBackAdmin = () => {
    navigate('/administration');
  };

  const formatLastSeen = (last_seen) => {
    return last_seen ? dateFormat(new Date(last_seen), t('global.shortDateTimeFormat')) : '';
  };

  useEffect(() => {
    console.log(isFetchingPersons);
    if (isFetchingPersons > 0) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [isFetchingPersons, setModalOpen]);

  if (!person) return <Navigate to="/administration" />;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <IconButton onClick={handleBackAdmin}>
          <ArrowBackIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ fontWeight: 'bold' }}>{t('administration.editCPEUser')}</Typography>
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <AccountCircleIcon color={person.global_role === 'vip' ? 'primary' : 'secondary'} sx={{ fontSize: '50px' }} />

          <Box sx={{ flexGrow: 1 }}>
            {/* Name and Email */}
            <Box>
              <Typography variant="h5" sx={{ minWidth: '300px', fontWeight: 'bold' }}>
                {person.username}
              </Typography>
              <Typography>{person.user_uid}</Typography>
            </Box>

            {/* Roles */}
            <Box sx={{ marginTop: '20px' }}>
              <Typography
                sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
              >
                {t('global.roles')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={member.cong_role?.includes('admin') || false}
                        disabled={member.global_role === 'pocket'}
                        onChange={(e) => handleCheckAdmin(e.target.checked)}
                      />
                    }
                    label={t('administration.roleAdmin')}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={member.cong_role?.includes('lmmo') || false}
                        disabled={member.global_role === 'pocket'}
                        onChange={(e) => handleCheckLMMO(e.target.checked)}
                      />
                    }
                    label={t('administration.roleLMMO')}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={member.cong_role?.includes('lmmo-backup') || false}
                        disabled={member.global_role === 'pocket'}
                        onChange={(e) => handleCheckLMMOAssistant(e.target.checked)}
                      />
                    }
                    label={t('administration.roleLMMOAssistant')}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={member.cong_role?.includes('view_meeting_schedule') || false}
                        disabled={member.global_role === 'vip'}
                        onChange={(e) => handleCheckViewMeetingSchedule(e.target.checked)}
                      />
                    }
                    label={t('administration.roleViewMeetingSchedule')}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Pocket Setup */}
            {member.global_role === 'pocket' && (
              <Box sx={{ marginTop: '20px' }}>
                <Typography
                  sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
                >
                  {t('administration.pocketSetupInstruction')}
                </Typography>

                {member.pocket_oCode !== '' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t('administration.pocketSetupSite')}</Typography>
                    <Typography>{t('administration.pocketSetupCode')}</Typography>
                    <TextField
                      id="outlined-token"
                      variant="outlined"
                      autoComplete="off"
                      value={member.pocket_oCode}
                      sx={{ width: '150px', input: { textAlign: 'center' } }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                )}

                {member.pocket_oCode === '' && (
                  <Button variant="contained">{t('administration.pocketAddDevice')}</Button>
                )}
              </Box>
            )}

            {/* Sessions or Devices */}
            <Box sx={{ marginTop: '20px' }}>
              <Typography
                sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
              >
                {t('administration.sessionsDevices')}
              </Typography>

              <Grid container spacing={2}>
                {person.global_role === 'vip' &&
                  person.sessions.map((session) => (
                    <Grid item key={session.visitorid} xs={12} lg={6}>
                      <Paper elevation={8} sx={{ padding: '10px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '20px',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GpsFixedIcon sx={{ fontSize: '60px', marginRight: '10px', color: '#1976d2' }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                                {`IP: ${session.visitor_details.ip} - ${session.visitor_details.ipLocation.country.name}`}
                              </Typography>
                              <Typography>
                                {`${session.visitor_details.browserDetails.browserName} (${session.visitor_details.browserDetails.os} ${session.visitor_details.browserDetails.osVersion})`}
                              </Typography>
                              <Typography>
                                {t('settings.lastSeen', { last_seen: formatLastSeen(session.sws_last_seen) })}
                              </Typography>
                              {visitorID === session.visitorid && (
                                <Box>
                                  <Chip
                                    label={t('settings.currentSession')}
                                    sx={{
                                      backgroundColor: '#145A32',
                                      color: 'white',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                          {visitorID !== session.visitorid && (
                            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                              <Button variant="outlined" color="error" sx={{ marginBottom: '10px' }}>
                                {t('settings.sessionRevoke')}
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}

                {person.global_role === 'pocket' &&
                  person.pocket_devices.map((device) => (
                    <Grid item key={device.visitorid} xs={12} md={6}>
                      <Paper elevation={8} sx={{ padding: '10px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '20px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <DevicesIcon
                              sx={{
                                fontSize: '60px',
                                marginRight: '10px',
                                color: '#1976d2',
                              }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <Typography sx={{ fontSize: '14px' }}>{device.name}</Typography>
                              <Box>
                                <Chip
                                  label={formatLastSeen(device.sws_last_seen)}
                                  sx={{
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    fontWeight: 'bold',
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" color="error" sx={{ marginBottom: '10px' }}>
                              {t('settings.sessionRevoke')}
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CongregationPersonDetails;
