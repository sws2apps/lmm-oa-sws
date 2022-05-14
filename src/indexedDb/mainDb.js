import Dexie from 'dexie';
import { getI18n } from 'react-i18next';
import { langList } from '../locales/langList';
import { dbGetAppSettings, dbUpdateAppSettings } from './dbAppSettings';
import { dbGetStudentUidById } from './dbPersons';
import { dbSaveScheduleByAss } from './dbSchedule';

var appDb = new Dexie('lmm_oa');
appDb.version(1).stores({
	app_settings: '++id, cong_number, cong_name, class_count, meeting_day',
	ass_type_MG: '&id_type, ass_type_name',
	week_type_MG: '&id_week_type, week_type_name',
	src_MG:
		'&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src',
	sched_MM:
		'&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, week_type, noMeeting',
	persons:
		'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment',
});
appDb.version(2).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, liveEventClass',
});
appDb.version(4).stores({
	persons:
		'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment',
});
appDb.version(5).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, cong_PIN',
});
appDb.version(6).stores({
	persons:
		'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, student_PIN, viewStudent_Part',
});
appDb.version(7).stores({
	persons:
		'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part',
});
appDb.version(8).stores({
	src_MG:
		'&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src',
	sched_MM:
		'&weekOf, bRead_stu_A, bRead_stu_B, ass1_stu_A, ass1_ass_A, ass1_stu_B, ass1_ass_B, ass2_stu_A, ass2_ass_A, ass2_stu_B, ass2_ass_B, ass3_stu_A, ass3_ass_A, ass3_stu_B, ass3_ass_B, ass4_stu_A, ass4_ass_A, ass4_stu_B, ass4_ass_B, week_type, noMeeting',
});
appDb.version(9).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID',
});
appDb.version(10).stores({
	src_MG: null,
	ass_type_MG: null,
	week_type_MG: null,
	src: '&weekOf, bibleReading_src, ass1_type, ass1_time, ass1_src, ass2_type, ass2_time, ass2_src, ass3_type, ass3_time, ass3_src, ass4_type, ass4_time, ass4_src',
	ass_type: '&id_type, ass_type_name',
	week_type: '&id_week_type, week_type_name',
});
appDb
	.version(11)
	.stores({
		persons:
			'++id, person_name, person_displayName, isMale, isFemale, isBRead, isInitialCall, isReturnVisit, isBibleStudy, isTalk, forLivePart, isUnavailable, lastBRead, lastInitialCall, lastReturnVisit, lastBibleStudy, lastTalk, lastAssistant, lastAssignment, viewOnlineSchedule, student_PIN, viewStudent_Part, person_uid',
	})
	.upgrade((trans) => {
		return trans.persons.toCollection().modify((person) => {
			const uid = window.crypto.randomUUID();
			person.person_uid = uid;
		});
	});
appDb.version(12).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted',
});
appDb.version(13).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isTermsUseAccepted',
});
appDb.version(14).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isTermsUseAccepted, pwd',
});
appDb.version(15).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, cong_ID, isScheduleConverted, isCongVerified',
});
appDb.version(16).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, pwd, isScheduleConverted, isCongVerified',
});
appDb.version(17).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userMe, isScheduleConverted, isCongVerified',
});
appDb.version(18).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, crd, isScheduleConverted, isCongVerified',
});
appDb.version(19).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
});
appDb.version(20).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, blob_exp, isScheduleConverted, isCongVerified',
});
appDb.version(21).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isScheduleConverted, isCongVerified',
});
appDb.version(22).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified',
});
appDb.version(23).stores({
	app_settings:
		'++id, cong_number, cong_name, class_count, meeting_day, userPass, isLoggedOut, isScheduleConverted, isCongVerified',
});

appDb.on('populate', function () {
	appDb.app_settings.add({
		id: 1,
		cong_number: 0,
		cong_name: '',
		class_count: 1,
		meeting_day: 1,
		app_lang: 'e',
	});

	let initCallObj = {};
	let rvObj = {};
	let bsObj = {};
	let talkObj = {};
	let icVideoObj = {};
	let rvVideoObj = {};
	let otherObj = {};
	let memorialObj = {};
	let normWeekObj = {};
	let coWeekObj = {};
	let convWeekObj = {};

	langList.forEach((lang) => {
		initCallObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.initialCall'];
		rvObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.returnVisit'];
		bsObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.bibleStudy'];
		talkObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.talk'];
		otherObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.otherPart'];
		icVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.initialCallVideo'];
		rvVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.returnVisitVideo'];
		memorialObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.memorialInvite'];
		normWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.normalWeek'];
		coWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.circuitOverseerWeek'];
		convWeekObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.conventionWeek'];
	});

	appDb.ass_type.bulkAdd([
		{
			id_type: 1,
			ass_type_name: {
				...initCallObj,
			},
		},
		{
			id_type: 2,
			ass_type_name: {
				...rvObj,
			},
		},
		{
			id_type: 3,
			ass_type_name: {
				...bsObj,
			},
		},
		{
			id_type: 4,
			ass_type_name: {
				...talkObj,
			},
		},
		{
			id_type: 5,
			ass_type_name: {
				...icVideoObj,
			},
		},
		{
			id_type: 6,
			ass_type_name: {
				...rvVideoObj,
			},
		},
		{
			id_type: 7,
			ass_type_name: {
				...otherObj,
			},
		},
	]);

	appDb.week_type.bulkAdd([
		{
			id_week_type: 1,
			week_type_name: {
				...normWeekObj,
			},
		},
		{
			id_week_type: 2,
			week_type_name: {
				...coWeekObj,
			},
		},
		{
			id_week_type: 3,
			week_type_name: {
				...convWeekObj,
			},
		},
	]);
});

appDb.on('ready', async () => {
	// adding memorial part
	const memorialObj = await appDb.table('ass_type').get({ id_type: 20 });
	if (!memorialObj) {
		let obj = {};

		langList.forEach((lang) => {
			obj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
				lang.code
			).translation['global.memorialInvite'];
		});

		let data = {};
		data.id_type = 20;
		data.ass_type_name = obj;

		await appDb.table('ass_type').add(data);
	}

	// updating schedule assignment to use uid
	let appSettings = await dbGetAppSettings();
	if (!appSettings.isScheduleConverted) {
		var scheduleData = await appDb.table('sched_MM').toArray();

		for (let i = 0; i < scheduleData.length; i++) {
			const schedule = scheduleData[i];
			if (schedule.bRead_stu_A !== undefined) {
				const uid = await dbGetStudentUidById(schedule.bRead_stu_A);

				await dbSaveScheduleByAss('bRead_stu_A', uid, schedule.weekOf);
			}
			if (schedule.bRead_stu_B !== undefined) {
				const uid = await dbGetStudentUidById(schedule.bRead_stu_B);
				await dbSaveScheduleByAss('bRead_stu_B', uid, schedule.weekOf);
			}
			for (let i = 1; i <= 4; i++) {
				const fldNameA = `ass${i}_stu_A`;
				if (schedule[fldNameA] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameA]);
					await dbSaveScheduleByAss(fldNameA, uid, schedule.weekOf);
				}

				const fldNameAssA = `ass${i}_ass_A`;
				if (schedule[fldNameAssA] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameAssA]);
					await dbSaveScheduleByAss(fldNameAssA, uid, schedule.weekOf);
				}

				const fldNameB = `ass${i}_stu_B`;
				if (schedule[fldNameB] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameB]);
					await dbSaveScheduleByAss(fldNameB, uid, schedule.weekOf);
				}

				const fldNameAssB = `ass${i}_ass_B`;
				if (schedule[fldNameAssB] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameAssB]);
					await dbSaveScheduleByAss(fldNameAssB, uid, schedule.weekOf);
				}
			}
		}

		// save settings
		let obj = {};
		obj.isScheduleConverted = true;
		await dbUpdateAppSettings(obj);
	}

	// remove trailing crd and pwd settings props
	if (appSettings.crd) {
		delete appSettings.crd;
		await dbUpdateAppSettings({ ...appSettings }, true);
	}
	if (appSettings.pwd) {
		delete appSettings.pwd;
		await dbUpdateAppSettings({ ...appSettings }, true);
	}
});

export default appDb;
