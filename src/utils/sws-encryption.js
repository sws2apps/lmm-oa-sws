import tinyEnc from 'tiny-enc';

export const encryptString = async (secret, payload) => {
	const encrypted = await tinyEnc.encrypt(secret, payload);
	return encrypted;
};

export const decryptString = async (secret, payload) => {
	try {
	console.log(secret, payload);
	const decrypted = await tinyEnc.decrypt(secret, payload);
	console.log(decrypted);
	return decrypted;
	} catch (err) {
		console.log(err)
	}
};
