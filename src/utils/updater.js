import { promiseSetRecoil } from 'recoil-outside';
import { getI18n } from 'react-i18next';
import dateFormat from 'dateformat';
import appDb from '../indexedDb/mainDb';
import { SOURCELANGUAGE_LIST } from '../locales/langList.js';
import { dbGetAppSettings, dbUpdateAppSettings } from '../indexedDb/dbAppSettings';
import { dbGetStudents, dbGetStudentUidById, dbSavePersonMigration } from '../indexedDb/dbPersons';
import { dbSaveScheduleByAss } from '../indexedDb/dbSchedule';
import {
  dbFirstBibleStudy,
  dbFirstBRead,
  dbFirstIniCall,
  dbFirstRV,
  dbFirstTalk,
  dbHistoryAssignment,
} from '../indexedDb/dbAssignment';
import { dbGetAllSourceMaterials, dbMigrateSrcData } from '../indexedDb/dbSourceMaterial';
import { studentsAssignmentHistoryState } from '../states/persons';
import { startupProgressState } from '../states/main';
import { loadApp } from './app';

let i = 0;

export const runUpdater = async () => {
  const step = 100 / 4;

  await updateAssignmentType(step);
  await updateScheduleToId(step);
  await removeOutdatedSettings(step);
  await builtHistoricalAssignment(step);
  await loadApp();
  i = 0;
};

const updateScheduleToId = async (step) => {
  let appSettings = await dbGetAppSettings();
  if (!appSettings.isScheduleConverted) {
    const scheduleData = await appDb.table('sched_MM').toArray();

    let a = step / scheduleData.length;
    for (let c = 0; c < scheduleData.length; c++) {
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
  if (appSettings.isAssignmentsConverted === undefined || !appSettings.isAssignmentsConverted) {
    const allSources = await dbGetAllSourceMaterials();
    for (let s = 0; s < allSources.length; s++) {
      const source = allSources[s];
      let obj = { ...source };
      for (let t = 1; t < 5; t++) {
        const fldName = `ass${t}_type`;
        if (source[fldName] === 1) {
          obj[fldName] = 101;
        } else if (source[fldName] === 2) {
          obj[fldName] = 102;
        } else if (source[fldName] === 3) {
          obj[fldName] = 103;
        } else if (source[fldName] === 4) {
          obj[fldName] = 104;
        } else if (source[fldName] === 5) {
          obj[fldName] = 105;
        } else if (source[fldName] === 6) {
          obj[fldName] = 106;
        } else if (source[fldName] === 7) {
          obj[fldName] = 107;
        } else if (source[fldName] === 20) {
          obj[fldName] = 108;
        }
      }

      await dbMigrateSrcData(obj);
    }

    const history = await dbHistoryAssignment();
    await promiseSetRecoil(studentsAssignmentHistoryState, history);

    const students = await dbGetStudents();
    if (students.length > 0) {
      const a = step / students.length;
      const today = dateFormat(new Date(), 'mm/dd/yyyy');
      for (let b = 0; b < students.length; b++) {
        const student = students[b];
        const firstBRead = (await dbFirstBRead(student.person_uid)) || today;
        const firstIniCall = (await dbFirstIniCall(student.person_uid)) || today;
        const firstRV = (await dbFirstRV(student.person_uid)) || today;
        const firstBibleStudy = (await dbFirstBibleStudy(student.person_uid)) || today;
        const firstTalk = (await dbFirstTalk(student.person_uid)) || today;
        student.assignments = [];

        if (student.isBRead) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 100,
            startDate: firstBRead,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isInitialCall) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 101,
            startDate: firstIniCall,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isReturnVisit) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 102,
            startDate: firstRV,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isBibleStudy) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 103,
            startDate: firstBibleStudy,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        if (student.isTalk) {
          const assignmentId = window.crypto.randomUUID();
          let obj = {
            assignmentId: assignmentId,
            code: 104,
            startDate: firstTalk,
            endDate: null,
            comments: '',
          };
          student.assignments.push(obj);
        }

        await dbSavePersonMigration(student);

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
  let memorialVideoObj = {};
  let chairmanMMObj = {};
  let prayerMMObj = {};
  let tgwTalkObj = {};
  let tgwGemsObj = {};
  let lcPartObj = {};
  let cbsConductorObj = {};
  let cbsReaderObj = {};

  SOURCELANGUAGE_LIST.forEach((lang) => {
    bReadObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['bibleReading'];
    initCallObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['initialCall'];
    rvObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['returnVisit'];
    bsObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['bibleStudy'];
    talkObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['talk'];
    otherObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['otherPart'];
    icVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['initialCallVideo'];
    rvVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['returnVisitVideo'];
    memorialObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['memorialInvite'];
    memorialVideoObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['memorialInviteVideo'];
    chairmanMMObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['chairmanMidweekMeeting'];
    prayerMMObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['prayerMidweekMeeting'];
    tgwTalkObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['tgwTalk'];
    tgwGemsObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['tgwGems'];
    lcPartObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['lcPart'];
    cbsConductorObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['cbsConductor'];
    cbsReaderObj[lang.code.toUpperCase()] = getI18n().getDataByLanguage(lang.code).ui['cbsReader'];
  });

  await appDb.assignment.clear();

  await appDb.assignment.put(
    {
      code: 100,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...bReadObj,
      },
      id_type: 1,
    },
    1
  );

  await appDb.assignment.put(
    {
      code: 101,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...initCallObj,
      },
      id_type: 2,
    },
    2
  );

  await appDb.assignment.put(
    {
      code: 102,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...rvObj,
      },
      id_type: 3,
    },
    3
  );

  await appDb.assignment.put(
    {
      code: 103,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...bsObj,
      },
      id_type: 4,
    },
    4
  );

  await appDb.assignment.put(
    {
      code: 104,
      maleOnly: true,
      assignable: true,
      type: 'ayf',
      assignment_type_name: {
        ...talkObj,
      },
      id_type: 5,
    },
    5
  );

  await appDb.assignment.put(
    {
      code: 105,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...icVideoObj,
      },
      id_type: 6,
    },
    6
  );

  await appDb.assignment.put(
    {
      code: 106,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...rvVideoObj,
      },
      id_type: 7,
    },
    7
  );

  await appDb.assignment.put(
    {
      code: 107,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...otherObj,
      },
      id_type: 8,
    },
    8
  );

  await appDb.assignment.put(
    {
      code: 108,
      linkTo: 101,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...memorialObj,
      },
      id_type: 9,
    },
    9
  );

  await appDb.assignment.put(
    {
      code: 110,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      assignment_type_name: {
        ...chairmanMMObj,
      },
      id_type: 10,
    },
    10
  );

  await appDb.assignment.put(
    {
      code: 111,
      maleOnly: true,
      assignable: true,
      type: 'mm',
      assignment_type_name: {
        ...prayerMMObj,
      },
      id_type: 11,
    },
    11
  );

  await appDb.assignment.put(
    {
      code: 112,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...tgwTalkObj,
      },
      id_type: 12,
    },
    12
  );

  await appDb.assignment.put(
    {
      code: 113,
      maleOnly: true,
      assignable: true,
      type: 'tgw',
      assignment_type_name: {
        ...tgwGemsObj,
      },
      id_type: 13,
    },
    13
  );

  await appDb.assignment.put(
    {
      code: 114,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...lcPartObj,
      },
      id_type: 14,
    },
    14
  );

  await appDb.assignment.put(
    {
      code: 115,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...cbsConductorObj,
      },
      id_type: 15,
    },
    15
  );

  await appDb.assignment.put(
    {
      code: 116,
      maleOnly: true,
      assignable: true,
      type: 'lc',
      assignment_type_name: {
        ...cbsReaderObj,
      },
      id_type: 16,
    },
    16
  );

  await appDb.assignment.put(
    {
      code: 117,
      linkTo: 105,
      assignable: false,
      type: 'ayf',
      assignment_type_name: {
        ...memorialVideoObj,
      },
      id_type: 17,
    },
    17
  );

  i = i + step;
  promiseSetRecoil(startupProgressState, i);
};
