import SimpleCrypto from 'simple-crypto-js';

export const encryptString = (secret, payload) => {
	const simpleCrypto = new SimpleCrypto(secret);
	return simpleCrypto.encrypt(payload);
};

export const decryptString = (secret, payload) => {
	const simpleCrypto = new SimpleCrypto(secret);
	return simpleCrypto.decrypt(payload);
};
