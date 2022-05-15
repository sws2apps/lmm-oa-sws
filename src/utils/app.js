// dependency
import { getI18n } from 'react-i18next';
import { promiseSetRecoil } from 'recoil-outside';

// utils
import { dbGetAppSettings } from '../indexedDb/dbAppSettings';
import {
	checkSrcUpdate,
	dbGetListWeekType,
	dbGetYearList,
} from '../indexedDb/dbSourceMaterial';
import { dbGetListAssType } from '../indexedDb/dbAssignment';
import { dbGetStudents } from '../indexedDb/dbPersons';
import { initAppDb } from '../indexedDb/dbUtility';

// states
import {
	classCountState,
	congNameState,
	congNumberState,
	liveClassState,
	meetingDayState,
} from '../appStates/appCongregation';
import { appLangState } from '../appStates/appSettings';
import {
	assTypeListState,
	weekTypeListState,
	yearsListState,
} from '../appStates/appSourceMaterial';
import {
	allStudentsState,
	filteredStudentsState,
} from '../appStates/appStudents';

export const loadApp = async () => {
	const I18n = getI18n();

	await initAppDb();
	let { cong_number, cong_name, class_count, meeting_day, liveEventClass } =
		await dbGetAppSettings();

	const app_lang = localStorage.getItem('app_lang') || 'e';

	await checkSrcUpdate();

	await promiseSetRecoil(congNameState, cong_name);
	await promiseSetRecoil(congNumberState, cong_number);
	await promiseSetRecoil(classCountState, class_count);
	await promiseSetRecoil(meetingDayState, meeting_day);
	await promiseSetRecoil(appLangState, app_lang);
	await promiseSetRecoil(liveClassState, liveEventClass);

	I18n.changeLanguage(app_lang);

	const weekTypeList = await dbGetListWeekType();
	await promiseSetRecoil(weekTypeListState, weekTypeList);

	const assTypeList = await dbGetListAssType();
	await promiseSetRecoil(assTypeListState, assTypeList);

	const data = await dbGetStudents();
	await promiseSetRecoil(allStudentsState, data);
	await promiseSetRecoil(filteredStudentsState, data);

	const years = await dbGetYearList();
	await promiseSetRecoil(yearsListState, years);
};