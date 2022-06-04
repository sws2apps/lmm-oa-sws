import { atom } from 'recoil';

export const allStudentsState = atom({
	key: 'allStudents',
	default: [],
});

export const filteredStudentsState = atom({
	key: 'filteredStudents',
	default: [],
});

export const studentsAllState = atom({
	key: 'studentsAll',
	default: [],
});

export const studentsAssignmentHistoryState = atom({
	key: 'studentsAssignmentHistory',
	default: [],
});
