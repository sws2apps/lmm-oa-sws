import { promiseSetRecoil } from 'recoil-outside';
import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { langList } from '../locales/langList';
import {
	dbGetAppSettings,
	dbUpdateAppSettings,
} from '../indexedDb/dbAppSettings';
import {
	dbGetStudents,
	dbGetStudentUidById,
	dbSavePerson,
} from '../indexedDb/dbPersons';
import { dbSaveScheduleByAss } from '../indexedDb/dbSchedule';
import { startupProgressState } from '../appStates/appSettings';
import {
	dbFirstBibleStudy,
	dbFirstBRead,
	dbFirstIniCall,
	dbFirstRV,
	dbFirstTalk,
} from '../indexedDb/dbAssignment';

let i = 0;

export const runUpdater = async () => {
	const step = 100 / 4;

	await updateAssignmentType(step);
	await updateScheduleToId(step);
	await removeOutdatedSettings(step);
	await builtHistoricalAssignment(step);
};

const updateScheduleToId = async (step) => {
	let appSettings = await dbGetAppSettings();
	if (!appSettings.isScheduleConverted) {
		var scheduleData = await appDb.table('sched_MM').toArray();

		let a = step / scheduleData.length;
		for (let c = 0; i < scheduleData.length; c++) {
			const schedule = scheduleData[c];
			if (schedule.bRead_stu_A !== undefined) {
				const uid = await dbGetStudentUidById(schedule.bRead_stu_A);

				await dbSaveScheduleByAss('bRead_stu_A', uid, schedule.weekOf);
			}
			if (schedule.bRead_stu_B !== undefined) {
				const uid = await dbGetStudentUidById(schedule.bRead_stu_B);
				await dbSaveScheduleByAss('bRead_stu_B', uid, schedule.weekOf);
			}
			for (let d = 1; d <= 4; d++) {
				const fldNameA = `ass${d}_stu_A`;
				if (schedule[fldNameA] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameA]);
					await dbSaveScheduleByAss(fldNameA, uid, schedule.weekOf);
				}

				const fldNameAssA = `ass${d}_ass_A`;
				if (schedule[fldNameAssA] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameAssA]);
					await dbSaveScheduleByAss(fldNameAssA, uid, schedule.weekOf);
				}

				const fldNameB = `ass${d}_stu_B`;
				if (schedule[fldNameB] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameB]);
					await dbSaveScheduleByAss(fldNameB, uid, schedule.weekOf);
				}

				const fldNameAssB = `ass${d}_ass_B`;
				if (schedule[fldNameAssB] !== undefined) {
					const uid = await dbGetStudentUidById(schedule[fldNameAssB]);
					await dbSaveScheduleByAss(fldNameAssB, uid, schedule.weekOf);
				}
			}

			i = i + a;
			promiseSetRecoil(startupProgressState, i);
		}

		// save settings
		let obj = {};
		obj.isScheduleConverted = true;
		await dbUpdateAppSettings(obj);
	} else {
		i = i + step;
		promiseSetRecoil(startupProgressState, i);
	}
};

const removeOutdatedSettings = async (step) => {
	let appSettings = await dbGetAppSettings();
	appSettings = await dbGetAppSettings();
	if (appSettings.crd) {
		delete appSettings.crd;
		await dbUpdateAppSettings({ ...appSettings }, true);
	}
	if (appSettings.pwd) {
		delete appSettings.pwd;
		await dbUpdateAppSettings({ ...appSettings }, true);
	}
	if (appSettings.userMe) {
		delete appSettings.userMe;
		await dbUpdateAppSettings({ ...appSettings }, true);
	}
	i = i + step;
	promiseSetRecoil(startupProgressState, i);
};

const builtHistoricalAssignment = async (step) => {
	let appSettings = await dbGetAppSettings();
	appSettings = await dbGetAppSettings();
	if (!appSettings.isAssignmentsConverted) {
		const students = await dbGetStudents();
		if (students.length > 0) {
			const a = step / students.length;
			const today = dateFormat(new Date(), 'mm/dd/yyyy');
			for (let b = 0; b < students.length; b++) {
				const student = students[b];
				const firstBRead = (await dbFirstBRead(student.person_uid)) || today;
				const firstIniCall =
					(await dbFirstIniCall(student.person_uid)) || today;
				const firstRV = (await dbFirstRV(student.person_uid)) || today;
				const firstBibleStudy =
					(await dbFirstBibleStudy(student.person_uid)) || today;
				const firstTalk = (await dbFirstTalk(student.person_uid)) || today;
				student.assignments = [];

				if (student.isBRead) {
					let obj = { code: 100, startDate: firstBRead, endDate: null };
					student.assignments.push(obj);
				}

				if (student.isInitialCall) {
					let obj = { code: 101, startDate: firstIniCall, endDate: null };
					student.assignments.push(obj);
				}

				if (student.isReturnVisit) {
					let obj = { code: 102, startDate: firstRV, endDate: null };
					student.assignments.push(obj);
				}

				if (student.isBibleStudy) {
					let obj = { code: 103, startDate: firstBibleStudy, endDate: null };
					student.assignments.push(obj);
				}

				if (student.isTalk) {
					let obj = { code: 104, startDate: firstTalk, endDate: null };
					student.assignments.push(obj);
				}

				console.log(student);

				await dbSavePerson(student.person_uid, student);

				i = i + a;
				promiseSetRecoil(startupProgressState, i);
			}
		}

		// save settings
		let obj = {};
		obj.isAssignmentsConverted = true;
		await dbUpdateAppSettings(obj);
	} else {
		i = i + step;
		promiseSetRecoil(startupProgressState, i);
	}
};

const updateAssignmentType = async (step) => {
	let bReadObj = {};
	let initCallObj = {};
	let rvObj = {};
	let bsObj = {};
	let talkObj = {};
	let icVideoObj = {};
	let rvVideoObj = {};
	let otherObj = {};
	let memorialObj = {};

	langList.forEach((lang) => {
		bReadObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(
			lang.code
		).translation['global.bibleReading'];
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
	});

	await appDb.ass_type.clear();

	appDb.ass_type.bulkAdd([
		{
			id_type: 8,
			code: 100,
			assignable: true,
			ass_type_name: {
				...bReadObj,
			},
		},
		{
			id_type: 1,
			code: 101,
			assignable: true,
			ass_type_name: {
				...initCallObj,
			},
		},
		{
			id_type: 2,
			code: 102,
			assignable: true,
			ass_type_name: {
				...rvObj,
			},
		},
		{
			id_type: 3,
			code: 103,
			assignable: true,
			ass_type_name: {
				...bsObj,
			},
		},
		{
			id_type: 4,
			code: 104,
			assignable: true,
			ass_type_name: {
				...talkObj,
			},
		},
		{
			id_type: 5,
			code: 105,
			assignable: false,
			ass_type_name: {
				...icVideoObj,
			},
		},
		{
			id_type: 6,
			code: 106,
			assignable: false,
			ass_type_name: {
				...rvVideoObj,
			},
		},
		{
			id_type: 7,
			code: 107,
			assignable: false,
			ass_type_name: {
				...otherObj,
			},
		},
		{
			id_type: 20,
			code: 108,
			linkTo: 101,
			assignable: false,
			ass_type_name: {
				...memorialObj,
			},
		},
	]);

	i = i + step;
	promiseSetRecoil(startupProgressState, i);
};
