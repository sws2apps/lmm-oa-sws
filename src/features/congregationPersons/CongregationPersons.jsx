import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';
import CongregationPersonsGroup from './CongregationPersonsGroup';

const CongregationPersons = () => {
  const { t } = useTranslation();

  const cancel = useRef();

  const navigate = useNavigate();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(true);
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    navigate('/administration/members/new');
  };

  const handleFetchUsers = useCallback(async () => {
    if (apiHost !== '') {
      cancel.current = false;

      const res = await fetch(`${apiHost}api/congregations/${congID}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
          email: userEmail,
        },
      });

      return await res.json();
    }
  }, [apiHost, congID, userEmail, visitorID]);

  const { isLoading, error, data } = useQuery({ queryKey: ['congPersons'], queryFn: handleFetchUsers });

  useEffect(() => {
    if (data) {
      const tempData1 = data.reduce((group, person) => {
        const { global_role } = person;
        group[global_role] = group[global_role] ?? [];
        group[global_role].push(person);
        return group;
      }, {});

      const tempData2 = [];
      Object.keys(tempData1).forEach(function (key, index) {
        const obj = {
          global_role: key,
          persons: tempData1[key],
          label: key === 'vip' ? t('administration.vipUsersHeading') : t('administration.pocketUsersHeading'),
        };

        tempData2.push(obj);
      });

      tempData2.sort((a, b) => {
        return a.label > b.label ? 1 : -1;
      });

      setMembers(tempData2);
    }
  }, [data, t]);

  useEffect(() => {
    setIsProcessing(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setAppMessage(error);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  }, [error, setAppMessage, setAppSeverity, setAppSnackOpen]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box>
      <Box
        sx={{
          padding: '10px',
          marginTop: '20px',
          marginBottom: '60px',
        }}
      >
        {isProcessing && (
          <CircularProgress
            color="secondary"
            size={40}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '10px auto',
            }}
          />
        )}
        {!isProcessing &&
          members.length > 0 &&
          members.map((group) => <CongregationPersonsGroup key={group.global_role} congregationGroup={group} />)}
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleAddMember}>
          <PersonAddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default CongregationPersons;
