import { atom } from 'recoil';

export const isLightThemeState = atom({
  key: 'isLightTheme',
  default: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? false : true,
});

export const isPrecachedState = atom({
  key: 'isPrecached',
  default: false,
});

export const showReloadState = atom({
  key: 'showReload',
  default: false,
});

export const rootModalOpenState = atom({
  key: 'rootModalOpen',
  default: false,
});

export const appLangState = atom({
  key: 'appLang',
  default: (typeof window !== 'undefined' && localStorage.getItem('app_lang')) || 'e',
});

export const isOnlineState = atom({
  key: 'isOnline',
  default: navigator.onLine,
});

export const apiHostState = atom({
  key: 'apiHost',
  default: '',
});

export const visitorIDState = atom({
  key: 'visitorID',
  default: '',
});

export const isAuthProcessingState = atom({
  key: 'isAuthProcessing',
  default: false,
});

export const isEmailAuthState = atom({
  key: 'isEmailAuth',
  default: false,
});

export const isOAuthAccountUpgradeState = atom({
  key: 'isOAuthAccountUpgrade',
  default: false,
});
