import { getAuth } from 'firebase/auth';
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import { congIDState } from '../states/congregation';
import { isOAuthAccountUpgradeState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { getProfile } from './common';

export const apiSendAuthorization = async () => {
  try {
    const { apiHost, isOnline, visitorID } = await getProfile();

    if (isOnline && apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

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

export const apiHandleVerifyOTP = async (userOTP, isSetup, trustedDevice) => {
  try {
    const { t } = getI18n();

    const { apiHost, visitorID } = await getProfile();

    const auth = await getAuth();
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
          body: JSON.stringify({ token: userOTP, trusted: trustedDevice }),
        });

        const data = await res.json();

        if (res.status !== 200) {
          if (data.message) {
            if (data.message === 'TOKEN_INVALID') data.message = t('mfaTokenInvalidExpired', { ns: 'ui' });
            await promiseSetRecoil(appMessageState, data.message);
            await promiseSetRecoil(appSeverityState, 'warning');
            await promiseSetRecoil(appSnackOpenState, true);
            return { tokenInvalid: true };
          }
        }

        const { cong_id, cong_name, cong_role } = data;

        if (cong_name.length === 0) return { createCongregation: true };

        if (cong_role.length === 0) return { unauthorized: true };

        if (!cong_role.includes('lmmo') && !cong_role.includes('lmmo-backup')) return { unauthorized: true };

        await promiseSetRecoil(congIDState, cong_id);
        return { success: true };
      }
    }
  } catch (err) {
    await promiseSetRecoil(appMessageState, err.message);
    await promiseSetRecoil(appSeverityState, 'error');
    await promiseSetRecoil(appSnackOpenState, true);
    return {};
  }
};

export const apiRequestPasswordlesssLink = async (email, uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, appLang } = await getProfile();

    const isOAuthAccountUpgrade = await promiseGetRecoil(isOAuthAccountUpgradeState);

    if (apiHost !== '') {
      const res = await fetch(`${apiHost}user-passwordless-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          applanguage: appLang,
        },
        body: JSON.stringify({ email, uid }),
      });

      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem('emailForSignIn', email);
        if (isOAuthAccountUpgrade) {
          await promiseSetRecoil(appMessageState, t('oauthAccountUpgradeEmailComplete', { ns: 'ui' }));
        } else {
          await promiseSetRecoil(appMessageState, t('emailAuthSent', { ns: 'ui' }));
        }

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

export const apiUpdatePasswordlessInfo = async (uid) => {
  const { t } = getI18n();

  try {
    const { apiHost, visitorID } = await getProfile();

    if (apiHost !== '') {
      const tmpEmail = localStorage.getItem('emailForSignIn');

      const res = await fetch(`${apiHost}user-passwordless-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          uid,
        },
        body: JSON.stringify({ email: tmpEmail, visitorid: visitorID }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.removeItem('emailForSignIn');
        return { isVerifyMFA: true, tmpEmail };
      } else {
        if (data.message) {
          await promiseSetRecoil(appMessageState, t('verifyEmailError', { ns: 'ui' }));
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

export const apiPocketSignUp = async (code) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/sws-pocket/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitorid: visitorID, otp_code: code.toUpperCase() }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiPocketValidate = async () => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/sws-pocket/validate-me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
        },
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchPocketSessions = async () => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
        },
      });

      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiPocketDeviceDelete = async (pocket_visitorid) => {
  const { apiHost, userID, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/sws-pocket/${userID}/devices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
        },
        body: JSON.stringify({ pocket_visitorid }),
      });

      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};
