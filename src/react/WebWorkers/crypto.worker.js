import { decryptString, encryptString } from "../Functions/Crypto/Crypto.js";

const defaultError = (error, taskId) => {
    console.error(error);
    postMessage({
        error: error,
        taskId: taskId
    });
};

onmessage = e => {
    const taskId = e.data.taskId;
    const { type, data, encryptionKey, iv = false } = e.data.task;

    if (type === "DECRYPT") {
        // decrypt the data with the given key and iv
        decryptString(data, encryptionKey, iv)
            .then(data => {
                try {
                    postMessage({
                        data: JSON.parse(data),
                        taskId: taskId
                    });
                } catch (error) {
                    defaultError(error, taskId);
                }
            })
            .catch(error => defaultError(error, taskId));
    }

    if (type === "ENCRYPT") {
        // encrypt the data with the given encryption key
        encryptString(data, encryptionKey)
            .then(data => {
                postMessage({
                    taskId: taskId,
                    data: data
                });
            })
            .catch(error => {
                defaultError(error, taskId);
            });
    }
};
