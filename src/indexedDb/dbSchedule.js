import { dbGetAppSettings } from './dbAppSettings';
import { dbSaveAss } from './dbAssignment';
import { dbGetPersonsByAssType, dbGetStudentByUid } from './dbPersons';
import {
	dbGetSourceMaterial,
	dbGetWeekListBySched,
	dbGetWeekTypeName,
} from './dbSourceMaterial';
import appDb from './mainDb';

export const dbGetScheduleData = async (weekValue) => {
	const appData = await appDb.table('sched_MM').get({ weekOf: weekValue });
	var schedule = {};
	var student = {};
	schedule.weekOf = appData.weekOf;
	if (typeof appData.bRead_stu_A === 'undefined') {
		schedule.bRead_stu_A = '';
		schedule.bRead_stu_A_dispName = '';
	} else {
		schedule.bRead_stu_A = appData.bRead_stu_A;
		student = await dbGetStudentByUid(schedule.bRead_stu_A);
		schedule.bRead_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.bRead_stu_B === 'undefined') {
		schedule.bRead_stu_B = '';
		schedule.bRead_stu_B_dispName = '';
	} else {
		schedule.bRead_stu_B = appData.bRead_stu_B;
		student = await dbGetStudentByUid(schedule.bRead_stu_B);
		schedule.bRead_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_A === 'undefined') {
		schedule.ass1_stu_A = '';
		schedule.ass1_stu_A_dispName = '';
	} else {
		schedule.ass1_stu_A = appData.ass1_stu_A;
		student = await dbGetStudentByUid(schedule.ass1_stu_A);
		schedule.ass1_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_A === 'undefined') {
		schedule.ass1_ass_A = '';
		schedule.ass1_ass_A_dispName = '';
	} else {
		schedule.ass1_ass_A = appData.ass1_ass_A;
		student = await dbGetStudentByUid(schedule.ass1_ass_A);
		schedule.ass1_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_stu_B === 'undefined') {
		schedule.ass1_stu_B = '';
		schedule.ass1_stu_B_dispName = '';
	} else {
		schedule.ass1_stu_B = appData.ass1_stu_B;
		student = await dbGetStudentByUid(schedule.ass1_stu_B);
		schedule.ass1_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass1_ass_B === 'undefined') {
		schedule.ass1_ass_B = '';
		schedule.ass1_ass_B_dispName = '';
	} else {
		schedule.ass1_ass_B = appData.ass1_ass_B;
		student = await dbGetStudentByUid(schedule.ass1_ass_B);
		schedule.ass1_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_A === 'undefined') {
		schedule.ass2_stu_A = '';
		schedule.ass2_stu_A_dispName = '';
	} else {
		schedule.ass2_stu_A = appData.ass2_stu_A;
		student = await dbGetStudentByUid(schedule.ass2_stu_A);
		schedule.ass2_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_A === 'undefined') {
		schedule.ass2_ass_A = '';
		schedule.ass2_ass_A_dispName = '';
	} else {
		schedule.ass2_ass_A = appData.ass2_ass_A;
		student = await dbGetStudentByUid(schedule.ass2_ass_A);
		schedule.ass2_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_stu_B === 'undefined') {
		schedule.ass2_stu_B = '';
		schedule.ass2_stu_B_dispName = '';
	} else {
		schedule.ass2_stu_B = appData.ass2_stu_B;
		student = await dbGetStudentByUid(schedule.ass2_stu_B);
		schedule.ass2_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass2_ass_B === 'undefined') {
		schedule.ass2_ass_B = '';
		schedule.ass2_ass_B_dispName = '';
	} else {
		schedule.ass2_ass_B = appData.ass2_ass_B;
		student = await dbGetStudentByUid(schedule.ass2_ass_B);
		schedule.ass2_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_A === 'undefined') {
		schedule.ass3_stu_A = '';
		schedule.ass3_stu_A_dispName = '';
	} else {
		schedule.ass3_stu_A = appData.ass3_stu_A;
		student = await dbGetStudentByUid(schedule.ass3_stu_A);
		schedule.ass3_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_A === 'undefined') {
		schedule.ass3_ass_A = '';
		schedule.ass3_ass_A_dispName = '';
	} else {
		schedule.ass3_ass_A = appData.ass3_ass_A;
		student = await dbGetStudentByUid(schedule.ass3_ass_A);
		schedule.ass3_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_stu_B === 'undefined') {
		schedule.ass3_stu_B = '';
		schedule.ass3_stu_B_dispName = '';
	} else {
		schedule.ass3_stu_B = appData.ass3_stu_B;
		student = await dbGetStudentByUid(schedule.ass3_stu_B);
		schedule.ass3_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass3_ass_B === 'undefined') {
		schedule.ass3_ass_B = '';
		schedule.ass3_ass_B_dispName = '';
	} else {
		schedule.ass3_ass_B = appData.ass3_ass_B;
		student = await dbGetStudentByUid(schedule.ass3_ass_B);
		schedule.ass3_ass_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_A === 'undefined') {
		schedule.ass4_stu_A = '';
		schedule.ass4_stu_A_dispName = '';
	} else {
		schedule.ass4_stu_A = appData.ass4_stu_A;
		student = await dbGetStudentByUid(schedule.ass4_stu_A);
		schedule.ass4_stu_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_A === 'undefined') {
		schedule.ass4_ass_A = '';
		schedule.ass4_ass_A_dispName = '';
	} else {
		schedule.ass4_ass_A = appData.ass4_ass_A;
		student = await dbGetStudentByUid(schedule.ass4_ass_A);
		schedule.ass4_ass_A_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_stu_B === 'undefined') {
		schedule.ass4_stu_B = '';
		schedule.ass4_stu_B_dispName = '';
	} else {
		schedule.ass4_stu_B = appData.ass4_stu_B;
		student = await dbGetStudentByUid(schedule.ass4_stu_B);
		schedule.ass4_stu_B_dispName = student.person_displayName;
	}
	if (typeof appData.ass4_ass_B === 'undefined') {
		schedule.ass4_ass_B = '';
		schedule.ass4_ass_B_dispName = '';
	} else {
		schedule.ass4_ass_B = appData.ass4_ass_B;
		student = await dbGetStudentByUid(schedule.ass4_ass_B);
		schedule.ass4_ass_B_dispName = student.person_displayName;
	}
	schedule.week_type = parseInt(appData.week_type, 10) || 1;

	schedule.week_type_name = await dbGetWeekTypeName(schedule.week_type);
	schedule.noMeeting = appData.noMeeting || false;
	return schedule;
};

export const dbAutoFill = async (schedule) => {
	const allWeeks = await dbGetWeekListBySched(schedule);
	const settings = await dbGetAppSettings();

	for (let i = 0; i < allWeeks.length; i++) {
		const weekValue = allWeeks[i].value;
		const scheduleData = await dbGetScheduleData(weekValue);
		const sourceData = await dbGetSourceMaterial(weekValue);

		if (scheduleData.noMeeting === false) {
			//Assign Bible Reading A
			var students = [];
			students = await dbGetPersonsByAssType('isBRead');
			if (students.length > 0) {
				const stuBReadA = students[0].person_uid;
				await dbSaveAss(weekValue, stuBReadA, 'bRead_stu_A', 0);
			}

			//Assign Bible Reading B
			if (settings.class_count === 2 && scheduleData.week_type === 1) {
				students = await dbGetPersonsByAssType('isBRead');
				if (students.length > 0) {
					const stuBReadB = students[0].person_uid;
					await dbSaveAss(weekValue, stuBReadB, 'bRead_stu_B', 0);
				}
			}

			//Assign AYF
			for (let a = 1; a <= 3; a++) {
				const fldType = 'ass' + a + '_type';
				const assType = sourceData[fldType];
				var fldName = '';

				//Assign AYF A
				fldName = 'ass' + a + '_stu_A';
				if (assType === 1 || assType === 20) {
					students = await dbGetPersonsByAssType('isInitialCall');
				} else if (assType === 2) {
					students = await dbGetPersonsByAssType('isReturnVisit');
				} else if (assType === 3) {
					students = await dbGetPersonsByAssType('isBibleStudy');
				} else if (assType === 4) {
					students = await dbGetPersonsByAssType('isTalk');
				}
				if (
					assType === 1 ||
					assType === 2 ||
					assType === 3 ||
					assType === 4 ||
					assType === 20
				) {
					if (students.length > 0) {
						const stuA = students[0].person_uid;
						await dbSaveAss(weekValue, stuA, fldName, assType);
					}
				}

				//Assign AYF A Assistant
				if (assType === 1 || assType === 2 || assType === 3 || assType === 20) {
					fldName = 'ass' + a + '_ass_A';
					students = await dbGetPersonsByAssType('isAssistant');
					if (students.length > 0) {
						const assA = students[0].person_uid;
						await dbSaveAss(weekValue, assA, fldName, 8);
					}
				}

				//Assign AYF B
				if (settings.class_count === 2 && scheduleData.week_type === 1) {
					fldName = 'ass' + a + '_stu_B';
					if (assType === 1 || assType === 20) {
						students = await dbGetPersonsByAssType('isInitialCall');
					} else if (assType === 2) {
						students = await dbGetPersonsByAssType('isReturnVisit');
					} else if (assType === 3) {
						students = await dbGetPersonsByAssType('isBibleStudy');
					} else if (assType === 4) {
						students = await dbGetPersonsByAssType('isTalk');
					}

					if (
						assType === 1 ||
						assType === 2 ||
						assType === 3 ||
						assType === 4 ||
						assType === 20
					) {
						if (students.length > 0) {
							const stuB = students[0].person_uid;
							await dbSaveAss(weekValue, stuB, fldName, assType);
						}
					}

					//Assign AYF B Assistant
					if (
						assType === 1 ||
						assType === 2 ||
						assType === 3 ||
						assType === 20
					) {
						fldName = 'ass' + a + '_ass_B';
						students = await dbGetPersonsByAssType('isAssistant');
						if (students.length > 0) {
							const assB = students[0].person_uid;
							await dbSaveAss(weekValue, assB, fldName, 8);
						}
					}
				}
			}
		}
	}
};

export const dbDeleteWeekAssignment = async (weekValue) => {
	const sourceData = await dbGetSourceMaterial(weekValue);

	//Delete Bible Reading A
	await dbSaveAss(weekValue, undefined, 'bRead_stu_A', 0);

	//Delete Bible Reading B
	await dbSaveAss(weekValue, undefined, 'bRead_stu_B', 0);

	//Delete AYF
	for (let a = 1; a <= 3; a++) {
		const fldType = 'ass' + a + '_type';
		const assType = sourceData[fldType];
		var fldName = '';

		//Delete AYF A
		fldName = 'ass' + a + '_stu_A';
		await dbSaveAss(weekValue, undefined, fldName, assType);

		//Delete AYF A Assistant
		fldName = 'ass' + a + '_ass_A';
		await dbSaveAss(weekValue, undefined, fldName, 8);

		//Delete AYF B
		fldName = 'ass' + a + '_stu_B';
		await dbSaveAss(weekValue, undefined, fldName, assType);

		//Delete AYF B Assistant
		fldName = 'ass' + a + '_ass_B';
		await dbSaveAss(weekValue, undefined, fldName, 8);
	}
};

export const dbBuildScheduleForShare = async (scheduleIndex) => {
	let dataMSC = [];

	const getWeeks = await dbGetWeekListBySched(scheduleIndex);
	for (let i = 0; i < getWeeks.length; i++) {
		const weekValue = getWeeks[i].value;
		const schedData = await dbGetScheduleData(weekValue);
		const sourceData = await dbGetSourceMaterial(weekValue);
		dataMSC.push({ ...schedData, ...sourceData });
	}

	return JSON.stringify(dataMSC);
};

export const dbSaveScheduleByAss = async (field, value, weekOf) => {
	var obj = {};
	obj[field] = value;

	await appDb.table('sched_MM').update(weekOf, { ...obj });
};
