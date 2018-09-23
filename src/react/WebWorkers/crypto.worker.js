import { decryptString, encryptString } from "../Helpers/Crypto.js";

const defaultError = error => {
    console.error(error);

    postMessage({
        error: error
    });
};

onmessage = e => {
    const { type, data, encryptionKey, iv = false } = e.data;

    if (type === "DECRYPT") {
        // decrypt the data with the given key and iv
        decryptString(data, encryptionKey, iv)
            .then(data => {
                try {
                    postMessage(JSON.parse(data));
                } catch (error) {
                    defaultError(error);
                }
            })
            .catch(error => defaultError(error));
    }

    if (type === "ENCRYPT") {
        // encrypt the data with the given encryption key
        encryptString(data, encryptionKey)
            .then(data => postMessage(data))
            .catch(error => defaultError(error));
    }
};
