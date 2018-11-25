import store from "store";
const CryptoWorker = require("worker-loader!../WebWorkers/crypto.worker.js");

/**
 * Decrypt data stored in a specific location
 * @param location
 * @param encryptionKey
 * @param iv
 * @returns {Promise<*>}
 */
export const storeDecryptString = async (location, encryptionKey, iv = false) => {
    const storedData = store.get(location);

    let storedIv = iv;
    if (iv === false) {
        storedIv = store.get(`${location}_IV`);
    }

    // return false if no data or IV was found
    if (!storedIv) return false;
    if (!storedData) return false;

    const cryptoWorker = new CryptoWorker();

    // send message to the worker
    cryptoWorker.postMessage({
        type: "DECRYPT",
        encryptionKey: encryptionKey,
        data: storedData,
        iv: storedIv
    });

    return new Promise((resolve, reject) => {
        cryptoWorker.onmessage = e => {
            resolve(e.data);

            cryptoWorker.terminate();
        };
    });
};

/**
 * Encrypt data in a specific location
 * @param data
 * @param location
 * @param encryptionKey
 * @returns {Promise<void>}
 */
export const storeEncryptString = async (data, location, encryptionKey) => {
    // stringify the data
    const jsonData = JSON.stringify(data);

    const cryptoWorker = new CryptoWorker();

    // send message to the worker
    cryptoWorker.postMessage({
        type: "ENCRYPT",
        encryptionKey: encryptionKey,
        data: jsonData
    });

    const encryptedDetails = await new Promise((resolve, reject) => {
        cryptoWorker.onmessage = e => resolve(e.data);
    });

    // store the key and iv details
    store.set(location, encryptedDetails.encryptedString);
    store.set(`${location}_IV`, encryptedDetails.iv);

    cryptoWorker.terminate();
};
