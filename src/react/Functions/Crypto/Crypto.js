const forge = require("./CustomForge");

/**
 * Hash an arbitrary string and return the hash and salt
 * @param password - any string
 * @param {boolean|string} salt - false or hex-encoded salt value
 * @param iterations - integer, recommended value is between 8k and 20k
 * @returns {Promise.<{key: string, salt: string}>}
 */
export const derivePasswordKey = async (password, salt = false, iterations = 10000) => {
    if (salt === false) {
        // no salt given, create a new random one
        salt = forge.random.getBytesSync(256);
    } else {
        // get bytes from the hex salt
        salt = forge.util.hexToBytes(salt);
    }

    // asynchronously derive a key from the password
    const derivedKey = await new Promise((resolve, reject) => {
        // derive a 32-byte key from the password
        forge.pkcs5.pbkdf2(password, salt, iterations, 16, (errorMessage, derivedKey) => {
            if (errorMessage) {
                reject(errorMessage);
            } else {
                resolve(derivedKey);
            }
        });
    });

    // encode the bytes as hex
    const hexKey = forge.util.bytesToHex(derivedKey);
    const hexSalt = forge.util.bytesToHex(salt);

    return {
        key: hexKey,
        salt: hexSalt
    };
};

/**
 * Encrypt a string with a pre-defined encryption key
 * @param string
 * @param encryptionKey
 * @returns {Promise.<{iv: string, encryptedString: string}>}
 */
export const encryptString = async (string, encryptionKey) => {
    // create a random initialization vector
    const iv = forge.random.getBytesSync(32);

    // turn hex-encoded key into bytes
    const encryptionKeyBytes = forge.util.hexToBytes(encryptionKey);

    // create a new aes-cbc cipher with our key
    const cipher = forge.cipher.createCipher("AES-CBC", encryptionKeyBytes);

    // turn our string into a buffer
    const buffer = forge.util.createBuffer(string, "utf8");

    cipher.start({ iv: iv });
    cipher.update(buffer);
    cipher.finish();

    return {
        iv: forge.util.bytesToHex(iv),
        key: encryptionKey,
        encryptedString: cipher.output.toHex()
    };
};

/**
 * Decrypts a string using the key and iv
 * @param encryptedString
 * @param key
 * @param iv
 * @returns {Promise.<String>}
 */
export const decryptString = async (encryptedString, key, iv) => {
    // get byte data from hex encoded strings
    const encrypedBytes = forge.util.hexToBytes(encryptedString);

    // create a new forge buffer using the bytes
    const encryptedBuffer = forge.util.createBuffer(encrypedBytes, "raw");
    const keyBytes = forge.util.hexToBytes(key);
    const ivBytes = forge.util.hexToBytes(iv);

    // create a new decipher with our key and iv
    const decipher = forge.cipher.createDecipher("AES-CBC", keyBytes);
    decipher.start({ iv: ivBytes });
    decipher.update(encryptedBuffer);

    // check the decipher results
    const result = decipher.finish();
    if (!result) {
        throw new Error("Failed to decrypt string");
    }

    // get the raw bytes from the forge buffer
    const outputBytes = decipher.output.getBytes();

    // turn forge bytes into a regular buffer
    const forgeBuffer = forge.util.createBuffer(outputBytes, "raw");

    // return the result as an utf8-encoded string
    return forgeBuffer.toString("utf8");
};
