import Dexie from 'dexie';

let backupDb = new Dexie('lmm_oa_backup');

backupDb.version(1).stores({
	backup: '++id, data',
});

export default backupDb;
