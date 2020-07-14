const PRIVATE_KEY = 'EAAoGMIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAMAJ7WdmUDkBejUPU+cc1Vt4FOE183rMz7J1bI5QfBAVqEeKJ95H3WYKOtuQxaKoOoHk37HPpRcJcZGVNFRglyGEbGFSU6EIDndP8XlmVes6jIpN1WAHv4daZA4hPApyBOFEU7YYI8JAH9s9ifkVVHuGqbEcGjsvow40L1pecvo9AgMBAAECgYBiGfAsHSkoJegPCPh8nM8lfe90qQHrnosPiErfXKAz+0xO13XMaHvib6FnnspHcJcK2ieoBwI4BXv9ufHUlM8+zoRaw27dsPzYuWXc0ZFoeGKP3GBRJLah4NI2OFXRJ8bdOQWkjhYSx8ODlcq/6BRonPseX2JNs8hL+LZkIWLnBQJBAN7Co9XcUNPUKI1vHc8JrUWVNQt1/aVvDPwgQyGu2H1BwG74+OSEeJogU3KsE4uVXuZHnnR3H5UQlf2PLPlVK7cCQQDcsbyCUYu9zwNTClu3u58zOXGLYX2k1W6qXOljpSICKKzGQOOirSjccn6B1OoJGwqZu4ztcf4/do3E31D91XGrAkBLfQhKU/PsJQxtCYe/fpcCapLkRGLlaiGrWz+ErZzdraeJs8OcpSu9h1DgHmItPjw/q2uOKkRAnrNFjvx9rhg3AkBO2y8pPWv6GVLtxAC7qM2cpwTcMayMTjrpoqM+GI4LSW9as2rjAI5eHob3axVoxYHHJo2XdijLklfbpZOx7ydbAkAefq50OUgT5RON1FDwv6NOoc/CZ16CvylB7DqjGaewcYtNW3hBJjvND3WDRgraSOa4tcS1Q3W7P+saGs6nmkR7';
/*  params: cipher  */
function decryption(cipher, key) {
  const rsaKey = decryptionKey(key);
  const decrypt = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(rsaKey), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr;
}

function decryptionKey(key) {
  const decrypt = new JSEncrypt();
  // decrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
  decrypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----${PRIVATE_KEY.substring(5)}-----END RSA PRIVATE KEY-----`);
  const uncrypted = decrypt.decrypt(key);
  return uncrypted;
}

export default decryption;
