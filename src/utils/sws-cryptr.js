import SimpleCrypto from 'simple-crypto-js';

export const encryptString = (secret, payload) => {
	const simpleCrypto = new SimpleCrypto(secret);
	return simpleCrypto.encrypt(payload);
};

export const decryptString = (secret, payload) => {
	const simpleCrypto = new SimpleCrypto(secret);
	// remove quotes
	const cypheredText = payload.substr(0, payload.length);
	console.log(payload);
	console.log(cypheredText);
	return simpleCrypto.decrypt(cypheredText);
};
