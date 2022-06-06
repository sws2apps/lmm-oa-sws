// dependency
import { getI18n } from 'react-i18next';
import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';

// utils
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';
import {
	checkSrcUpdate,
	dbGetListWeekType,
	dbGetYearList,
} from '../indexedDb/dbSourceMaterial';
import {
	dbGetListAssType,
	dbHistoryAssignment,
} from '../indexedDb/dbAssignment';
import { dbGetStudentsMini } from '../indexedDb/dbPersons';
import { initAppDb } from '../indexedDb/dbUtility';
import {
	dbGetNotifications,
	dbSaveNotifications,
} from '../indexedDb/dbNotifications';

// states
import {
	classCountState,
	congNameState,
	congNumberState,
	liveClassState,
	meetingDayState,
	usernameState,
} from '../appStates/appCongregation';
import {
	apiHostState,
	appLangState,
	appNotificationsState,
	isOnlineState,
} from '../appStates/appSettings';
import {
	assTypeListState,
	weekTypeListState,
	yearsListState,
} from '../appStates/appSourceMaterial';
import {
	allStudentsState,
	filteredStudentsState,
	studentsAssignmentHistoryState,
} from '../appStates/appStudents';

export const loadApp = async () => {
	const I18n = getI18n();

	await initAppDb();
	let {
		username,
		cong_number,
		cong_name,
		class_count,
		meeting_day,
		liveEventClass,
	} = await dbGetAppSettings();

	const app_lang = localStorage.getItem('app_lang') || 'e';

	await checkSrcUpdate();

	await promiseSetRecoil(usernameState, username || '');
	await promiseSetRecoil(congNameState, cong_name || '');
	await promiseSetRecoil(congNumberState, cong_number || '');
	await promiseSetRecoil(classCountState, class_count || 1);
	await promiseSetRecoil(meetingDayState, meeting_day || 3);
	await promiseSetRecoil(appLangState, app_lang || 'e');
	await promiseSetRecoil(liveClassState, liveEventClass || false);

	I18n.changeLanguage(app_lang);

	const weekTypeList = await dbGetListWeekType();
	await promiseSetRecoil(weekTypeListState, weekTypeList);

	const assTypeList = await dbGetListAssType();
	await promiseSetRecoil(assTypeListState, assTypeList);

	const data = await dbGetStudentsMini();
	await promiseSetRecoil(allStudentsState, data);
	await promiseSetRecoil(filteredStudentsState, data);

	const history = await dbHistoryAssignment();
	await promiseSetRecoil(studentsAssignmentHistoryState, history);

	const years = await dbGetYearList();
	await promiseSetRecoil(yearsListState, years);

	const notifications = await dbGetNotifications();
	await promiseSetRecoil(appNotificationsState, notifications);
};

export const fetchNotifications = async () => {
	try {
		const isOnline = await promiseGetRecoil(isOnlineState);
		const apiHost = await promiseGetRecoil(apiHostState);

		if (isOnline && apiHost !== '') {
			const res = await fetch(`${apiHost}api/user/announcement`, {
				method: 'GET',
			});

			const data = await res.json();
			await dbSaveNotifications(data);
		}
	} catch {}
};

export const sortHistoricalDateDesc = (data) => {
	data.sort((a, b) => {
		if (a.startDate === b.startDate) return 0;
		var dateA =
			a.startDate.split('/')[2] +
			'/' +
			a.startDate.split('/')[0] +
			'/' +
			a.startDate.split('/')[1];
		var dateB =
			b.startDate.split('/')[2] +
			'/' +
			b.startDate.split('/')[0] +
			'/' +
			b.startDate.split('/')[1];
		return dateA > dateB ? 1 : -1;
	});

	return data;
};

export const formatDateForCompare = (date) => {
	return new Date(date);
};