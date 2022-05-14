import Dexie from 'dexie';
import { exportDB, importDB } from 'dexie-export-import';
import download from 'downloadjs';
import appDb from './mainDb';
import backupDb from './backupDb';

import { encryptString } from '../utils/sws-encryption';
import { dbGetAppSettings, dbUpdateAppSettings } from './dbAppSettings';

export const initAppDb = async () => {
	await appDb.open();
};

export const initBackupDb = async () => {
	await backupDb.open();
};

export const deleteDbByName = async (dbName) => {
	await Dexie.delete(dbName);
};

export const deleteDbBackup = async (dbName) => {
	await backupDb.close();
	await backupDb.delete();
};

export const deleteDb = async () => {
	const databases = await Dexie.getDatabaseNames();

	for (let i = 0; i < databases.length; i++) {
		Dexie.delete(databases[i]);
	}
};

export const isDbExist = async (dbName) => {
	return new Promise((resolve, reject) => {
		Dexie.exists(dbName)
			.then(function (exists) {
				if (exists) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(function (error) {
				reject('error');
			});
	});
};

export const isValidJSON = async (fileJSON) => {
	var isValid = false;
	const getJSON = () => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsText(fileJSON);
			reader.onload = () => resolve(JSON.parse(reader.result));
			reader.onerror = (error) => reject(error);
		});
	};

	const data = await getJSON();
	if (data.formatName === 'dexie') {
		if (data.data.databaseName === 'lmm_oa') {
			isValid = true;
		}
	}
	return isValid;
};

export const dbRestoreDb = async (fileJSON) => {
	// get user credentials before import
	const { userPass } = await dbGetAppSettings();

	// do restore
	await appDb.close();
	await appDb.delete();
	await importDB(fileJSON);

	// append saved user credentials
	await appDb.open();
	await dbUpdateAppSettings({ userPass: userPass });
	await appDb.close();
};

export const dbExportDb = async (passcode) => {
	try {
		// remove user credentials before export
		let appSettings = await dbGetAppSettings();
		const { userPass } = appSettings;
		delete appSettings.userPass;
		await dbUpdateAppSettings({ ...appSettings }, true);

		// export indexedDb
		const blob = await exportDB(appDb);

		// pause export and restore credentials as soon as indexedDb is exported
		await dbUpdateAppSettings({ userPass: userPass });

		// resume export function
		const convertBase64 = () => {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		};

		const data = await convertBase64();
		const encryptedData = await encryptString(passcode, data);

		const newBlob = new Blob([encryptedData], { type: 'text/plain' });

		download(newBlob, 'lmm-oa.backup.db', 'text/plain');
	} catch {
		return;
	}
};

export const dbExportJsonDb = async (passcode) => {
	const blob = await exportDB(appDb);
	const convertBase64 = () => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const data = await convertBase64();
	const encryptedData = await encryptString(passcode, data);
	return encryptedData;
};
