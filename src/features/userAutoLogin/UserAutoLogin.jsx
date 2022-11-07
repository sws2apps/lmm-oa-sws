import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { deleteDb } from '../../indexedDb/dbUtility';
import { congAccountConnectedState, congIDState, isAdminCongState } from '../../states/congregation';
import {
  apiHostState,
  isOnlineState,
  rootModalOpenState,
  userEmailState,
  userIDState,
  visitorIDState,
} from '../../states/main';

const UserAutoLogin = () => {
  let abortCont = useMemo(() => new AbortController(), []);

  const [userEmail, setUserEmail] = useRecoilState(userEmailState);
  const [visitorID, setVisitorID] = useRecoilState(visitorIDState);

  const setCongAccountConnected = useSetRecoilState(congAccountConnectedState);
  const setIsAdminCong = useSetRecoilState(isAdminCongState);
  const setCongID = useSetRecoilState(congIDState);
  const setUserID = useSetRecoilState(userIDState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    await deleteDb();
    localStorage.removeItem('email');
    window.location.href = './';
  }, [setModalOpen]);

  const checkLogin = useCallback(async () => {
    try {
      if (apiHost !== '' && userEmail !== '' && visitorID !== '') {
        const res = await fetch(`${apiHost}api/users/validate-me`, {
          signal: abortCont.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        const data = await res.json();

        // congregation found
        if (res.status === 200) {
          // role approved
          if (data.cong_role.includes('lmmo') || data.cong_role.includes('lmmo-backup')) {
            setCongAccountConnected(true);
            setCongID(data.cong_id);
            setUserID(data.id);

            // role admin
            if (data.cong_role.includes('admin')) {
              setIsAdminCong(true);
            }
            return;
          }

          // role disapproved
          await handleDisapproved();
          return;
        }

        // congregation not found
        if (res.status === 404) {
          // user not authorized and delete local data
          await handleDisapproved();
          return;
        }
      }
    } catch {}
  }, [
    apiHost,
    abortCont,
    handleDisapproved,
    visitorID,
    userEmail,
    setCongAccountConnected,
    setCongID,
    setIsAdminCong,
    setUserID,
  ]);

  useEffect(() => {
    setUserEmail(localStorage.getItem('email'));
  }, [setUserEmail]);

  useEffect(() => {
    if (isOnline) {
      checkLogin();
    } else {
      setCongAccountConnected(false);
      setIsAdminCong(false);
    }
  }, [checkLogin, isOnline, setCongAccountConnected, setIsAdminCong, userEmail]);

  return <></>;
};

export default UserAutoLogin;
