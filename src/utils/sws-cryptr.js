import CryptoJS from 'crypto-js';

export const encryptString = (secret, payload) => {
	return CryptoJS.AES.encrypt(payload, secret).toString();
};

export const decryptString = (secret, payload) => {
	const bytes = CryptoJS.AES.decrypt(payload, secret);
	return bytes.toString(CryptoJS.enc.Utf8);
};
