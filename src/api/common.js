import { promiseGetRecoil } from 'recoil-outside';
import { apiHostState, appLangState, isOnlineState, visitorIDState } from '../states/main';

export const getProfile = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const visitorID = await promiseGetRecoil(visitorIDState);
  const appLang = await promiseGetRecoil(appLangState);
  const isOnline = await promiseGetRecoil(isOnlineState);

  return { apiHost, appLang, visitorID, isOnline };
};
