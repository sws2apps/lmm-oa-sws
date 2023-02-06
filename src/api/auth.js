import { getAuth } from 'firebase/auth';
import { getI18n } from 'react-i18next';
import { promiseSetRecoil } from 'recoil-outside';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { initAppDb, isDbExist } from '../indexedDb/dbUtility';
import { congIDState, isAdminCongState, pocketMembersState } from '../states/congregation';
import { qrCodePathState, secretTokenPathState, userIDState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { loadApp } from '../utils/app';
import { getProfile } from './common';

export const apiSendAuthorization = async () => {
  try {
    const { apiHost, isOnline, visitorID } = await getProfile();

    const auth = getAuth();
    const user = auth.currentUser;

    if (isOnline && apiHost !== '' && visitorID && user) {
      const res = await fetch(`${apiHost}user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          uid: user.uid,
        },
        body: JSON.stringify({ visitorid: visitorID }),
      });
      const data = await res.json();

      if (res.status === 200) {
        return { isVerifyMFA: true };
      } else {
        if (data.secret && data.qrCode) {
          await promiseSetRecoil(secretTokenPathState, data.secret);
          await promiseSetRecoil(qrCodePathState, data.qrCode);
          return { isSetupMFA: true };
        }
        if (data.message) {
          await promiseSetRecoil(appMessageState, data.message);
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
        }
      }
    }

    return {};
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
  }
};

export const apiHandleVerifyOTP = async (userOTP, isSetup) => {
  try {
    const { apiHost, visitorID } = await getProfile();

    const auth = getAuth();
    const user = auth.currentUser;

    if (userOTP.length === 6) {
      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/mfa/verify-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ token: userOTP }),
        });

        const data = await res.json();
        if (res.status === 200) {
          const { id, cong_id, cong_name, cong_role, cong_number, pocket_members } = data;

          if (cong_name.length > 0) {
            if (cong_role.length > 0) {
              await promiseSetRecoil(congIDState, cong_id);

              if (!isSetup) {
                const settings = await dbGetAppSettings();
                if (settings.isCongUpdated2 === undefined) {
                  return { updateCongregation: true };
                }
              }

              if (cong_role.includes('admin')) {
                await promiseSetRecoil(isAdminCongState, true);
              }

              // role approved
              if (cong_role.includes('lmmo') || cong_role.includes('lmmo-backup')) {
                const isMainDb = await isDbExist('lmm_oa');
                if (!isMainDb) await initAppDb();

                // save congregation update if any
                let obj = {};
                obj.username = data.username;
                obj.cong_name = cong_name;
                obj.cong_number = cong_number;
                obj.isLoggedOut = false;
                obj.pocket_members = pocket_members;
                await dbUpdateAppSettings(obj);

                await promiseSetRecoil(userIDState, id);
                await promiseSetRecoil(pocketMembersState, pocket_members);

                await loadApp();

                return { success: true };
              }

              return { unauthorized: true };
            }
            return { unauthorized: true };
          }

          return { createCongregation: true };
        } else {
          if (data.message) {
            await promiseSetRecoil(appMessageState, data.message);
            await promiseSetRecoil(appSeverityState, 'warning');
            await promiseSetRecoil(appSnackOpenState, true);
            return {};
          }

          if (!isSetup && data.secret) {
            await promiseSetRecoil(secretTokenPathState, data.secret);
            await promiseSetRecoil(qrCodePathState, data.qrCode);
            return { reenroll: true };
          }
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiRequestPasswordlesssLink = async (email) => {
  const { t } = getI18n();

  try {
    const { apiHost, appLang } = await getProfile();

    if (apiHost !== '') {
      const res = await fetch(`${apiHost}user-passwordless-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          applanguage: appLang,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem('emailForSignIn', email);
        await promiseSetRecoil(appMessageState, t('emailAuthSent', { ns: 'ui' }));
        await promiseSetRecoil(appSeverityState, 'success');
        await promiseSetRecoil(appSnackOpenState, true);
        return { isSuccess: true };
      } else {
        if (data.message) {
          await promiseSetRecoil(appMessageState, data.message);
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
          return {};
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, t('sendEmailError', { ns: 'ui' }));
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiUpdatePasswordlessInfo = async (uid, fullname) => {
  const { t } = getI18n();

  try {
    const { apiHost, visitorID } = await getProfile();

    if (apiHost !== '') {
      const tmpEmail = localStorage.getItem('emailForSignIn');

      const res = await fetch(`${apiHost}user-passwordless-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          uid,
        },
        body: JSON.stringify({ email: tmpEmail, fullname, visitorid: visitorID }),
      });

      const data = await res.json();

      localStorage.removeItem('emailForSignIn');

      if (res.status === 200) {
        return { isVerifyMFA: true, tmpEmail };
      } else {
        if (data.secret && data.qrCode) {
          await promiseSetRecoil(secretTokenPathState, data.secret);
          await promiseSetRecoil(qrCodePathState, data.qrCode);
          return { isSetupMFA: true, tmpEmail };
        }
        if (data.message) {
          await promiseSetRecoil(appMessageState, data.message);
          await promiseSetRecoil(appSeverityState, 'warning');
          await promiseSetRecoil(appSnackOpenState, true);
          return {};
        }
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, t('verifyEmailError', { ns: 'ui' }));
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};
