import store from "store";
const CryptoWorker = require("worker-loader!../../WebWorkers/crypto.worker.js");

/**
 * Decrypt data stored in a specific location
 * @param location
 * @param encryptionKey
 * @param iv
 * @param type
 * @returns {Promise<*>}
 */
export const storeDecryptString = async (location, encryptionKey, iv = false, type = "LOCALSTORAGE") => {
    let handler = store;
    if (type === "INDEXEDDB") {
        handler = window.BunqDesktopClient.IndexedDb;
    }

    const storedDataPromise = handler.get(location);
    let storedIvPromise = iv;
    if (!storedIvPromise) {
        storedIvPromise = handler.get(`${location}_IV`);
    }

    // wait for the promises to complete
    const storedIv = await storedIvPromise;
    const storedData = await storedDataPromise;

    // return false if no data or IV was found
    if (!storedIv || !storedData) return false;

    const cryptoWorker = new CryptoWorker();

    // send message to the worker
    cryptoWorker.postMessage({
        type: "DECRYPT",
        encryptionKey: encryptionKey,
        data: storedData,
        iv: storedIv,
        tag: type
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
 * @param type
 * @returns {Promise<void>}
 */
export const storeEncryptString = async (data, location, encryptionKey, type = "LOCALSTORAGE") => {
    let handler = store;
    if (type === "INDEXEDDB") {
        handler = window.BunqDesktopClient.IndexedDb;
    }

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
    const setDataPromise = handler.set(location, encryptedDetails.encryptedString);
    const setIvPromise = handler.set(`${location}_IV`, encryptedDetails.iv);
    await setDataPromise;
    await setIvPromise;

    cryptoWorker.terminate();
};
