import store from "store";
const CryptoWorker = require("worker-loader!../../WebWorkers/crypto.worker.js");

class CryptoWorkerQueue {
    constructor() {
        this.queue = {};

        // setup a new cryptoWorker
        this.worker = new CryptoWorker();
        this.worker.onmessage = this.onMessage;
    }

    addTask = task => {
        // random ID
        const taskId = new Date().getTime() + (Math.random() + "");

        return new Promise((resolve, reject) => {
            // add this promise to the queue
            this.queue[taskId] = { resolve, reject };

            // post task to the cryptoWorker
            this.worker.postMessage({ taskId, task });
        });
    };

    onMessage = event => {
        const taskId = event.data.taskId;
        const promise = this.queue[taskId];

        if (promise) {
            if (event.data.error) {
                promise.reject(event.data.error);
            } else {
                promise.resolve(event.data.data);
            }

            delete this.queue[taskId];
        }
    };
}

if (!window.cryptoWorkerQueue) {
    window.cryptoWorkerQueue = new CryptoWorkerQueue();
}

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

    return window.cryptoWorkerQueue.addTask({
        type: "DECRYPT",
        encryptionKey: encryptionKey,
        data: storedData,
        iv: storedIv,
        tag: type
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
    const encryptedDetails = await window.cryptoWorkerQueue.addTask({
        type: "ENCRYPT",
        encryptionKey: encryptionKey,
        data: jsonData
    });

    // store the key and iv details
    const setDataPromise = handler.set(location, encryptedDetails.encryptedString);
    const setIvPromise = handler.set(`${location}_IV`, encryptedDetails.iv);
    await setDataPromise;
    await setIvPromise;
};
