import { promiseGetRecoil, promiseSetRecoil } from 'recoil-outside';
import dateFormat from 'dateformat';
import { dbGetSourceMaterial } from './dbSourceMaterial';
import { getI18n } from 'react-i18next';
import appDb from './mainDb';
import { allStudentsState, filteredStudentsState } from '../states/persons';
import { sortHistoricalDateDesc } from '../utils/app';
import { dbStudentAssignmentsHistory } from './dbAssignment';

export const dbGetStudents = async () => {
  let allStudents = [];

  const data = await appDb.table('persons').reverse().reverse().sortBy('person_name');

  const appData = data.filter((student) => student.isMoved === undefined || student.isMoved === false);

  for (let i = 0; i < appData.length; i++) {
    let person = {};
    person.id = appData[i].id;
    person.person_uid = appData[i].person_uid;
    person.person_name = appData[i].person_name;
    person.person_displayName = appData[i].person_displayName;
    person.isMale = appData[i].isMale;
    person.isFemale = appData[i].isFemale;
    person.isUnavailable = appData[i].isUnavailable;
    person.forLivePart = appData[i].forLivePart;
    person.viewOnlineSchedule = appData[i].viewOnlineSchedule || false;
    person.student_PIN = appData[i].student_PIN || '';
    person.viewStudent_Part = appData[i].viewStudent_Part || [];
    person.lastBRead = appData[i].lastBRead || '';
    person.lastInitialCall = appData[i].lastInitialCall || '';
    person.lastReturnVisit = appData[i].lastReturnVisit || '';
    person.lastBibleStudy = appData[i].lastBibleStudy || '';
    person.lastTalk = appData[i].lastTalk || '';
    person.isMoved = appData[i].isMoved || false;
    person.isDisqualified = appData[i].isDisqualified || false;
    let assignments = appData[i].assignments || [];
    person.assignments = sortHistoricalDateDesc(assignments);

    let timeAway = appData[i].timeAway || [];
    person.timeAway = sortHistoricalDateDesc(timeAway);

    allStudents.push(person);
  }
  return allStudents;
};

export const dbGetStudentsMini = async () => {
  let allStudents = [];

  const data = await appDb.table('persons').reverse().reverse().sortBy('person_name');

  const appData = data.filter((student) => student.isMoved === false);

  for (let i = 0; i < appData.length; i++) {
    let person = {};
    person.id = appData[i].id;
    person.person_uid = appData[i].person_uid;
    person.person_name = appData[i].person_name;
    person.person_displayName = appData[i].person_displayName;
    person.isMale = appData[i].isMale;
    person.isFemale = appData[i].isFemale;
    person.isDisqualified = appData[i].isDisqualified || false;
    person.lastAssignment = appData[i].lastAssignment;

    let assignments = appData[i].assignments.map((assignment) =>
      assignment.endDate === null ? { ...assignment, isActive: true } : { ...assignment, isActive: false }
    );
    person.assignments = sortHistoricalDateDesc(assignments);

    let timeAway = appData[i].timeAway || [];
    person.timeAway = sortHistoricalDateDesc(timeAway);

    allStudents.push(person);
  }
  return allStudents;
};

export const dbIsStudentExist = async (varName) => {
  var isExist = false;
  const appData = await appDb.table('persons').get({ person_name: varName });
  if (typeof appData !== 'undefined') {
    isExist = true;
  }
  return isExist;
};

export const dbSavePersonData = async (personData) => {
  const person = await dbGetStudentDetails(personData.person_uid);

  await appDb.table('persons').update(person.id, {
    person_name: personData.person_name,
    person_displayName: personData.person_displayName,
    isMale: personData.isMale,
    isFemale: personData.isFemale,
    isUnavailable: personData.isUnavailable,
    viewOnlineSchedule: personData.viewOnlineSchedule,
    student_PIN: personData.student_PIN,
    viewStudent_Part: personData.viewStudent_Part,
    assignments: personData.assignments,
  });
};

export const dbDeleteStudent = async (uid) => {
  const appData = await appDb.table('persons').get({ person_uid: uid });
  await appDb.persons.delete(appData.id);
};

export const dbAddPersonData = async (personData) => {
  await appDb.persons.add({
    person_uid: personData.person_uid,
    person_name: personData.person_name,
    person_displayName: personData.person_displayName,
    isMale: personData.isMale,
    isFemale: personData.isFemale,
    isUnavailable: personData.isUnavailable,
  });
};

export const dbGetStudentUidById = async (id) => {
  const appData = await appDb.table('persons').get({ id: id });
  return appData.person_uid;
};

export const dbGetStudentByUid = async (uid) => {
  const appData = await appDb.table('persons').get({ person_uid: uid });
  return appData;
};

export const dbGetStudentDetails = async (uid) => {
  const students = await promiseGetRecoil(allStudentsState);

  let student = students.find((student) => student.person_uid === uid);

  if (student) {
    let assignments = await dbStudentAssignmentsHistory(uid);
    student = { ...student, historyAssignments: assignments };
  }

  return student;
};

export const dbGetStudentDetailsMini = async (uid) => {
  const students = await promiseGetRecoil(allStudentsState);
  let student = { ...students.find((student) => student.person_uid === uid) };
  return student;
};

export const dbGetPersonsByAssType = async (assType) => {
  const data = await promiseGetRecoil(allStudentsState);
  // remove disqualified students
  const appData = data.filter((person) => person.isDisqualified === false);

  let dbPersons = [];
  if (assType === 'isAssistant') {
    dbPersons = appData.filter(
      (person) =>
        person.assignments.find((assignment) => assignment.isActive === true && assignment.code === 101) ||
        person.assignments.find((assignment) => assignment.isActive === true && assignment.code === 102) ||
        person.assignments.find((assignment) => assignment.isActive === true && assignment.code === 103)
    );
  } else {
    dbPersons = appData.filter((person) =>
      person.assignments.find((assignment) => assignment.isActive === true && assignment.code === assType)
    );
  }
  var persons = [];

  for (let i = 0; i < dbPersons.length; i++) {
    var person = {};
    person.person_uid = dbPersons[i].person_uid;
    person.lastAssignment = dbPersons[i].lastAssignment;
    if (typeof dbPersons[i].lastAssignment === 'undefined') {
      person.lastAssignmentFormat = '';
    } else {
      const [varMonth, varDay, varYear] = dbPersons[i].lastAssignment.split('/');
      var lDate = new Date(varYear, varMonth - 1, varDay);
      const dateFormatted = dateFormat(lDate, getI18n().t('global.shortDateFormat'));
      person.lastAssignmentFormat = dateFormatted;
    }
    person.person_displayName = dbPersons[i].person_displayName;
    person.timeAway = dbPersons[i].timeAway;
    persons.push(person);
  }

  persons.sort((a, b) => {
    if (typeof a.lastAssignment === 'undefined') return -1;
    if (typeof b.lastAssignment === 'undefined') return 1;
    if (a.lastAssignment === b.lastAssignment) return 0;
    var dateA =
      a.lastAssignment.split('/')[2] + '/' + a.lastAssignment.split('/')[0] + '/' + a.lastAssignment.split('/')[1];
    var dateB =
      b.lastAssignment.split('/')[2] + '/' + b.lastAssignment.split('/')[0] + '/' + b.lastAssignment.split('/')[1];
    return dateA > dateB ? 1 : -1;
  });
  return persons;
};

export const dbStudentID = async (varName) => {
  const appData = await appDb.table('persons').get({ person_displayName: varName });
  return appData.person_uid;
};

export const dbHistoryAssistant = async (mainStuID) => {
  mainStuID = await dbStudentID(mainStuID);
  const appData = await appDb.table('sched_MM').reverse().sortBy('weekOf');
  var dbHistory = [];
  var histID = 0;
  for (let i = 0; i < appData.length; i++) {
    var person = {};

    const weekData = await dbGetSourceMaterial(appData[i].weekOf);
    const [varMonth, varDay, varYear] = appData[i].weekOf.split('/');
    const lDate = new Date(varYear, varMonth - 1, varDay);
    const dateFormatted = dateFormat(lDate, 'dd/mm/yyyy');
    const cnAss = [{ iAss: 1 }, { iAss: 2 }, { iAss: 3 }];
    const varClasses = [{ classLabel: 'A' }, { classLabel: 'B' }];

    //AYF Assigment History
    for (let b = 0; b < cnAss.length; b++) {
      var weekFld = 'ass' + cnAss[b].iAss + '_type';
      const assType = weekData[weekFld];

      if (assType === 101 || assType === 102 || assType === 103 || assType === 108) {
        for (let a = 0; a < varClasses.length; a++) {
          const fldName = 'ass' + cnAss[b].iAss + '_stu_' + varClasses[a].classLabel;
          if (typeof appData[i][fldName] !== 'undefined') {
            if (appData[i][fldName] === mainStuID) {
              const assFldName = 'ass' + cnAss[b].iAss + '_ass_' + varClasses[a].classLabel;
              if (typeof appData[i][assFldName] !== 'undefined') {
                person.ID = histID;
                person.weekOf = appData[i].weekOf;
                person.weekOfFormatted = dateFormatted;
                person.mainStuID = appData[i][fldName];
                person.assistantStuID = appData[i][assFldName];
                const stuDetails = await dbGetStudentDetails(person.assistantStuID);
                person.assistantName = stuDetails.person_displayName;
                dbHistory.push(person);
                person = {};
                histID++;
              }
            }
          }
        }
      }
    }
  }

  return dbHistory;
};

export const dbSavePerson = async (uid, data) => {
  console.log(uid, data);
  const person = await dbGetStudentDetails(uid);
  await appDb.table('persons').update(person.id, {
    ...data,
  });
};

export const dbSavePersonMigration = async (data) => {
  await appDb.table('persons').update(data.id, {
    ...data,
  });
};

export const dbBuildPocketUsers = async () => {
  const students = await dbGetStudents();
  const pocketUsers = students.filter((student) => student.student_PIN > 0);

  const data = [];
  for (let i = 0; i < pocketUsers.length; i++) {
    let dispPart = [];
    let allPart = [];
    const viewPart = pocketUsers[i].viewStudent_Part;
    for (let a = 0; a < viewPart.length; a++) {
      const child = await dbGetStudentDetails(viewPart[a]);
      dispPart.push(child.person_displayName);
      allPart.push(child);
    }

    const obj = {
      ...pocketUsers[i],
      viewPartName: dispPart,
      viewPartFull: allPart,
    };

    data.push(obj);
  }

  return data;
};

export const dbSavePersonExp = async (data) => {
  const { id, person_name, person_displayName } = data;
  if (person_name && person_displayName) {
    if (id) {
      if (data.historyAssignments) delete data.historyAssignments;
      await appDb.table('persons').update(id, data);
    } else {
      let obj = {
        person_uid: window.crypto.randomUUID(),
        isMoved: false,
        isDisqualified: false,
        ...data,
      };
      await appDb.persons.add(obj);
    }

    const students = await dbGetStudentsMini();
    await promiseSetRecoil(allStudentsState, students);
    await promiseSetRecoil(filteredStudentsState, students);
    return true;
  } else {
    return false;
  }
};

export const dbFilterStudents = async (data) => {
  const { txtSearch, isMale, isFemale, assTypes } = data;

  const dbStudents = await promiseGetRecoil(allStudentsState);

  let firstPassFiltered = [];
  for (let i = 0; i < dbStudents.length; i++) {
    const student = dbStudents[i];

    if (student.person_name.toLowerCase().includes(txtSearch.toLowerCase())) {
      if (isMale === isFemale) {
        firstPassFiltered.push(student);
      } else if (isMale !== isFemale) {
        if (student.isMale === isMale && student.isFemale === isFemale) {
          firstPassFiltered.push(student);
        }
      }
    }
  }

  let secondPassFiltered = [];
  for (let i = 0; i < firstPassFiltered.length; i++) {
    const student = firstPassFiltered[i];
    const assignments = student.assignments;

    let passed = true;

    for (let a = 0; a < assTypes.length; a++) {
      const found = assignments.find((assignment) => assignment.code === assTypes[a] && assignment.isActive === true);
      if (!found) {
        passed = false;
        break;
      }
    }

    if (passed) secondPassFiltered.push(student);
  }

  return secondPassFiltered;
};

export const dbRecentStudents = async (data) => {
  const recentStudents = data ? JSON.parse(data) : [];

  const dbStudents = await promiseGetRecoil(allStudentsState);

  const builtStudents = recentStudents.map((recent) => {
    const findStudent = dbStudents.find((student) => student.person_uid === recent);
    return findStudent;
  });

  return builtStudents;
};
