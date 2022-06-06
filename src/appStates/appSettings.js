import { atom, selector } from 'recoil';
import { getI18n } from 'react-i18next';

export const settingsState = atom({
	key: 'appSettings',
	default: {},
});

export const isAppLoadState = atom({
	key: 'isAppLoad',
	default: true,
});

export const isSetupState = atom({
	key: 'isSetup',
	default: false,
});

export const apiHostState = atom({
	key: 'apiHost',
	default: '',
});

export const isAboutOpenState = atom({
	key: 'isAboutOpen',
	default: false,
});

export const isLoginOpenState = atom({
	key: 'isLoginOpen',
	default: false,
});

export const appLangState = atom({
	key: 'appLang',
	default: localStorage.getItem('app_lang') || 'e',
});

export const uidUserState = atom({
	key: 'uidUser',
	default: '',
});

export const isCongConnectedState = atom({
	key: 'isCongConnected',
	default: false,
});

export const userPasswordState = atom({
	key: 'userPassowrd',
	default: '',
});

export const monthNamesState = selector({
	key: 'monthNames',
	get: ({ get }) => {
		const appLang = get(appLangState);

		let months = [];
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.january']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.february']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.march']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.april']
		);
		months.push(getI18n().getDataByLanguage(appLang).translation['global.may']);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.june']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.july']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.august']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.september']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.october']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.november']
		);
		months.push(
			getI18n().getDataByLanguage(appLang).translation['global.december']
		);

		return months;
	},
});

export const shortDateFormatState = selector({
	key: 'shortDateFormat',
	get: ({ get }) => {
		const appLang = get(appLangState);
		const format =
			getI18n().getDataByLanguage(appLang).translation[
				'global.shortDateFormat'
			];
		return format;
	},
});

export const shortDatePickerFormatState = selector({
	key: 'shortDatePickerFormat',
	get: ({ get }) => {
		const appLang = get(appLangState);
		const format =
			getI18n().getDataByLanguage(appLang).translation[
				'global.shortDatePickerFormat'
			];
		return format;
	},
});

export const isDeleteDbOpenState = atom({
	key: 'isDeleteDbOpen',
	default: false,
});

export const isBackupDbOpenState = atom({
	key: 'isBackupDbOpen',
	default: false,
});

export const isBackupOfflineState = atom({
	key: 'isBackupOffline',
	default: false,
});

export const isBackupOnlineState = atom({
	key: 'isBackupOnline',
	default: false,
});

export const isRestoreOfflineState = atom({
	key: 'isRestoreOffline',
	default: false,
});

export const isRestoreOnlineState = atom({
	key: 'isRestoreOnline',
	default: false,
});

export const backupEncryptedState = atom({
	key: 'backupEncrypted',
	default: {},
});

export const backupJsonDataState = atom({
	key: 'backupJsonData',
	default: undefined,
});

export const isUserLoggedState = atom({
	key: 'isUserLogged',
	default: false,
});

export const isCongLoginOpenState = atom({
	key: 'isCongLoginOpen',
	default: false,
});

export const isCongCreateAccountState = atom({
	key: 'isCongCreateAccount',
	default: false,
});

export const isCongSignInState = atom({
	key: 'isCongSignIn',
	default: false,
});

export const isCongUpdateAccountState = atom({
	key: 'isCongUpdateAccount',
	default: false,
});

export const appStageState = atom({
	key: 'appStage',
	default: 'LIVE',
});

export const isUserSignInState = atom({
	key: 'isUserSignIn',
	default: true,
});

export const isUserSignUpState = atom({
	key: 'isUserSignUp',
	default: false,
});

export const isEmailNotVerifiedState = atom({
	key: 'isEmailNotVerified',
	default: false,
});

export const isEmailBlockedState = atom({
	key: 'isEmailBlocked',
	default: false,
});

export const isCongAccountCreateState = atom({
	key: 'isCongAccountCreate',
	default: false,
});

export const isCongRequestSentState = atom({
	key: 'isCongRequestSent',
	default: false,
});

export const userEmailState = atom({
	key: 'userEmail',
	default: '',
});

export const isCongWaitRequestState = atom({
	key: 'isCongWaitRequest',
	default: false,
});

export const isShowTermsUseState = atom({
	key: 'isShowLAG',
	default: true,
});

export const visitorIDState = atom({
	key: 'visitorID',
	default: '',
});

export const qrCodePathState = atom({
	key: 'qrCodePath',
	default: '',
});

export const secretTokenPathState = atom({
	key: 'secretTokenPath',
	default: '',
});

export const isOnlineState = atom({
	key: 'isOnline',
	default: navigator.onLine,
});

export const isUserMfaSetupState = atom({
	key: 'isUserMfaSetup',
	default: false,
});

export const isUserMfaVerifyState = atom({
	key: 'isUserMfaVerify',
	default: false,
});

export const isUnauthorizedRoleState = atom({
	key: 'isUnauthorizedRole',
	default: false,
});

export const isAppClosingState = atom({
	key: 'isAppClosing',
	default: false,
});

export const isPrecachedState = atom({
	key: 'isPrecached',
	default: false,
});

export const showReloadState = atom({
	key: 'showReload',
	default: false,
});

export const waitingWorkerState = atom({
	key: 'waitingWorker',
	default: null,
});

export const isWhatsNewOpenState = atom({
	key: 'isWhatsNewOpen',
	default: false,
});

export const appNotificationsState = atom({
	key: 'appNotifications',
	default: [],
});

export const countNotificationsState = selector({
	key: 'countNotifications',
	get: ({ get }) => {
		const notifications = get(appNotificationsState);
		const unread = notifications.filter(
			(notification) => notification.isRead !== true
		);
		return unread.length;
	},
});

export const currentNotificationState = atom({
	key: 'currentNotification',
	default: {},
});

export const startupProgressState = atom({
	key: 'startupProgress',
	default: 0,
});

export const rootModalOpenState = atom({
	key: 'rootModalOpen',
	default: false,
});