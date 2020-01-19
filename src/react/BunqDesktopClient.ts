import BunqJSClient from "@bunq-community/bunq-js-client";
import StorageInterface from "@bunq-community/bunq-js-client/dist/Interfaces/StorageInterface";
import awaiting from "awaiting";
import { Environment, StoredApiKey } from "./Types/Types";

import { decryptString, derivePasswordKey, encryptString } from "./Functions/Crypto/Crypto";
import { storeDecryptString, storeEncryptString } from "./Functions/Crypto/CryptoWorkerWrapper";
import Logger from "./Functions/Logger";
import localforage from "./ImportWrappers/localforage";
import store from "store/dist/store.legacy";

export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEYS_LOCATION = "BUNQDESKTOP_API_KEYS";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";

export const USE_NO_PASSWORD_LOCATION = "USE_NO_PASSWORD_LOCATION";
export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const DEFAULT_PASSWORD = "SOME_DEFAULT_PASSWORD";

const sortApiKeyList = (a, b) => {
    if (a.environment === "SANDBOX" && b.environment === "PRODUCTION") {
        return 1;
    }
    if (a.environment === "PRODUCTION" && b.environment === "SANDBOX") {
        return -1;
    }
    if (a.isOAuth && !b.isOAuth) return 1;
    if (!a.isOAuth && b.isOAuth) return -1;

    return a.device_name > b.device_name ? 1 : -1;
};

export class IndexedDbWrapper implements StorageInterface {
    private _indexedDb: LocalForageDriver;

    constructor(config: LocalForageOptions) {
        this._indexedDb = localforage.createInstance(config);
    }

    public get = async (key: string): Promise<any> => {
        return this._indexedDb.getItem(key);
    };
    public set = async (key: string, value: any): Promise<void> => {
        return this._indexedDb.setItem(key, value);
    };
    public remove = async (key: string): Promise<void> => {
        return this._indexedDb.removeItem(key);
    };
    public clear = async (): Promise<void> => {
        return this._indexedDb.clear();
    };

    /**
     * Does a remove action but swallows the promise and only outputs to logger
     * Used in Redux actions for cleanup where the result isn't important
     */
    public silentRemove = (key: string): void => {
        this.remove(key)
            .then(() => {})
            .catch(Logger.error);
    };
}

export class BunqDesktopClient {
    public BunqJSClient: BunqJSClient;
    public Logger: any;
    public Store: StorageInterface;
    public IndexedDb: IndexedDbWrapper;
    public ImageIndexedDb: IndexedDbWrapper;

    private derived_password: string | false = false;
    private derived_password_salt: string | false = false;
    private password_identifier: string | false = false;

    private api_key: string | false = false;
    private encrypted_api_key: string | false = false;
    private encrypted_api_key_iv: string | false = false;
    private permitted_ips: string[] = [];
    private device_name: string = "My device";
    public environment: Environment = "PRODUCTION";

    private stored_api_keys: StoredApiKey[] = [];

    constructor(BunqJSClient, Logger, Store: StorageInterface) {
        this.BunqJSClient = BunqJSClient;
        this.Logger = Logger;
        this.Store = Store;

        const basicConfig: LocalForageOptions = {
            driver: localforage.INDEXEDDB,
            name: "bunqDesktop",
            version: 1.0
        };

        // setup two references to the main indexedDb stores
        this.IndexedDb = new IndexedDbWrapper({
            ...basicConfig,
            storeName: "bunq_desktop_api_data",
            description: "The main bunq-desktop-client data, not including session info"
        });
        this.ImageIndexedDb = new IndexedDbWrapper({
            ...basicConfig,
            storeName: "bunq_desktop_images",
            description: "Image cache for bunq desktop in indexed db"
        });

        // current session data if it exists
        this.device_name = this.getStoredValue(DEVICE_NAME_LOCATION, "My device");
        this.encrypted_api_key = this.getStoredValue(API_KEY_LOCATION, false);
        this.encrypted_api_key_iv = this.getStoredValue(API_KEY_IV_LOCATION, false);
        this.environment = this.getStoredValue(ENVIRONMENT_LOCATION, "PRODUCTION");
        this.stored_api_keys = this.getStoredValue(API_KEYS_LOCATION, []);
    }

    /**
     * Wrappers around the bunqJSClient functions
     */
    public async BunqJSClientRun() {
        await this.BunqJSClient.run(this.api_key, this.permitted_ips, this.environment, this.derived_password);
    }
    public async BunqJSClientInstall() {
        await this.BunqJSClient.install();
    }
    public async BunqJSClientRegisterDevice() {
        await this.BunqJSClient.registerDevice(this.device_name);
    }
    public async BunqJSClientRegisterSession() {
        await this.BunqJSClient.registerSession();
    }
    public async BunqJSClientGetUsers() {
        const users = await this.BunqJSClient.getUsers(true);
        if (!users) return users;

        const userTypes = Object.keys(users);
        if (!userTypes.includes("UserApiKey")) return users;

        const storedApiKeys = this.storedApiKeys;
        const currentApiKeyIndex = storedApiKeys.findIndex(storedApiKey => {
            // this is the same stored api key
            return storedApiKey.api_key === this.encrypted_api_key;
        });

        if (currentApiKeyIndex > -1 && storedApiKeys[currentApiKeyIndex]) {
            const currentStoredApiKey = storedApiKeys[currentApiKeyIndex];
            currentStoredApiKey.isOAuth = true;

            // store the new stored api keys
            this.setStoredValue(API_KEYS_LOCATION, storedApiKeys);
            this.stored_api_keys = storedApiKeys;
        }

        return users;
    }

    /**
     * Sets a new API key and stores the encrypted variations
     * @param {string} apiKey
     * @param {string} deviceName
     * @param {Environment} environment
     * @param {string[]} permittedIps
     * @returns {Promise<void>}
     */
    public async setupNewApiKey(
        apiKey: string,
        deviceName: string,
        environment: Environment,
        permittedIps: string[] = []
    ) {
        const encrypedData = await encryptString(apiKey, this.derived_password);
        this.api_key = apiKey;
        this.encrypted_api_key = encrypedData.encryptedString;
        this.encrypted_api_key_iv = encrypedData.iv;
        this.device_name = deviceName;
        this.environment = environment;
        this.permitted_ips = permittedIps;

        this.setStoredValue(API_KEY_LOCATION, this.encrypted_api_key);
        this.setStoredValue(API_KEY_IV_LOCATION, this.encrypted_api_key_iv);
        this.setStoredValue(SALT_LOCATION, this.derived_password_salt);
        this.setStoredValue(DEVICE_NAME_LOCATION, this.device_name);
        this.setStoredValue(ENVIRONMENT_LOCATION, this.environment);

        // store the new api key in the stored api key list
        const storedApiKeyInfo: StoredApiKey = {
            identifier: this.password_identifier,
            api_key: this.encrypted_api_key,
            api_key_iv: this.encrypted_api_key_iv,
            permitted_ips: this.permitted_ips,
            device_name: this.device_name,
            environment: this.environment,
            isOAuth: false
        };
        const storedApiKeys = this.storedApiKeys;
        storedApiKeys.push(storedApiKeyInfo);

        // store the new stored api keys
        this.setStoredValue(API_KEYS_LOCATION, storedApiKeys);
        this.stored_api_keys = storedApiKeys;
    }

    /**
     * Loads the currently selected API key
     * @returns {Promise<boolean>}
     */
    public async loadApiKey(): Promise<string | boolean> {
        this.encrypted_api_key = this.getStoredValue(API_KEY_LOCATION);
        this.encrypted_api_key_iv = this.getStoredValue(API_KEY_IV_LOCATION);

        if (this.encrypted_api_key && this.encrypted_api_key_iv) {
            return this.decryptApiKey();
        }
        return false;
    }

    /**
     * Sets the password and calculates the derived password and its salt/identifier
     * @param {string} password
     * @param {boolean} skippedPassword
     * @returns {Promise<void>}
     */
    public async setupPassword(password: string, skippedPassword: boolean = false): Promise<void> {
        // get the stored salt or fallback to false
        const salt = this.getStoredValue(SALT_LOCATION, false);

        // reset skip password value
        if (!skippedPassword) this.setStoredValue(USE_NO_PASSWORD_LOCATION, false);

        // derive the password itself
        const derivedPassword = await derivePasswordKey(password, salt, 250000);
        // create a quick identifier based on this exact key
        const derivedIdentifier = await derivePasswordKey(derivedPassword.key + "identifier", salt, 100000);

        this.derived_password = derivedPassword.key;
        this.derived_password_salt = derivedPassword.salt;
        this.password_identifier = derivedIdentifier.key;

        // store the new salt value
        this.setStoredValue(SALT_LOCATION, this.derived_password_salt);
    }

    /**
     * Sets the password default password and then starts the standard setupPassword flow
     * @returns {Promise<void>}
     */
    public async skipPassword() {
        // mark the password as "skipped" where the default password is used
        this.setStoredValue(USE_NO_PASSWORD_LOCATION, true);

        // go through the standard flow
        return this.setupPassword(DEFAULT_PASSWORD, true);
    }

    /**
     * Updates all encrypted data using a new password
     * @param newPassword
     * @returns {Promise<void>}
     */
    public async changePassword(newPassword) {
        // get the stored salt or fallback to false
        this.derived_password_salt = this.getStoredValue(SALT_LOCATION, false);

        // derive a key from the new password
        const derivedPassword = await derivePasswordKey(newPassword, this.derived_password_salt, 250000);
        const derivedIdentifier = await derivePasswordKey(
            derivedPassword.key + "identifier",
            this.derived_password_salt,
            100000
        );

        // attempt to change the value in the bunqJSClient
        const success = await this.BunqJSClient.changeEncryptionKey(derivedPassword.key);
        if (success) {
            const storedApiKeys = this.storedApiKeys;

            // go through all stored keys and update them
            const updatedStoredApiKeys = await awaiting.map(storedApiKeys, 10, async (storedApiKey: StoredApiKey) => {
                // skip stored keys where
                if (storedApiKey.identifier !== this.password_identifier) {
                    return storedApiKey;
                }

                // update the key data with the new password
                const { api_key, api_key_iv } = await this.updateApiKeyEncryption(
                    derivedPassword.key,
                    storedApiKey.api_key,
                    storedApiKey.api_key_iv
                );

                // return the stored key object with the encrypted keys
                return {
                    ...storedApiKey,
                    identifier: derivedIdentifier.key,
                    api_key: api_key,
                    api_key_iv: api_key_iv
                };
            });

            // if we have a key in memory, update that to
            if (this.encrypted_api_key !== false && this.encrypted_api_key_iv !== false) {
                // update the key data with the new password
                const { api_key, api_key_iv } = await this.updateApiKeyEncryption(
                    derivedPassword.key,
                    this.encrypted_api_key,
                    this.encrypted_api_key_iv
                );

                // store the new values in storage
                this.encrypted_api_key = api_key;
                this.encrypted_api_key_iv = api_key_iv;
                this.setStoredValue(API_KEY_LOCATION, api_key);
                this.setStoredValue(API_KEY_IV_LOCATION, api_key_iv);
            }

            // after successfully changing the stored api keys update the password in memory
            this.derived_password = derivedPassword.key;
            this.password_identifier = derivedIdentifier.key;

            // disable use no password settings since a password is set now
            this.setStoredValue(USE_NO_PASSWORD_LOCATION, false);
            // store new stored api key list
            this.setStoredApiKeys(updatedStoredApiKeys);
        }
    }

    /**
     * Decrypts with the current password, and returns the encrypted version with a new password
     * @param {string} newEncryptionKey
     * @param {StoredApiKey} storedApiKey
     * @returns {Promise}
     */
    private async updateApiKeyEncryption(newEncryptionKey: string, apiKey: string, apiKeyIv: string) {
        // decrypt the stored api key with the current password
        const decryptedApiKey = await decryptString(apiKey, this.derived_password, apiKeyIv);

        // basic key validation
        if (!decryptedApiKey || decryptedApiKey.length !== 64) {
            throw new Error(`Failed to load API key: with length: ${decryptedApiKey.length}`);
        }

        // encrypt the api key with the new encryption key
        const { iv, encryptedString } = await encryptString(decryptedApiKey, newEncryptionKey);

        // return an updated object with the newly encrypted key
        return {
            api_key: encryptedString,
            api_key_iv: iv
        };
    }

    /**
     * Loads an API key from the stored api key list based on its index
     * @param {number} keyIndex
     * @returns {Promise<boolean>}
     */
    public async switchStoredApiKey(keyIndex: number): Promise<boolean> {
        this.stored_api_keys = this.storedApiKeys;

        // get currently stored api key
        if (this.stored_api_keys.length === 0 || !this.stored_api_keys[keyIndex]) {
            // no api key stored on this index
            this.Logger.error(
                `No stored API keys or index not found (index: ${keyIndex}) in storedKeys ${this.stored_api_keys.length}`
            );
            return false;
        }

        const storedApiKeyInfo = this.stored_api_keys[keyIndex];
        this.encrypted_api_key = storedApiKeyInfo.api_key;
        this.encrypted_api_key_iv = storedApiKeyInfo.api_key_iv;
        this.environment = storedApiKeyInfo.environment;
        this.device_name = storedApiKeyInfo.device_name;
        this.permitted_ips = storedApiKeyInfo.permitted_ips;

        // overwrite currently stored encrypted API key/iv, device name and environment
        this.setStoredValue(API_KEY_LOCATION, this.encrypted_api_key);
        this.setStoredValue(API_KEY_IV_LOCATION, this.encrypted_api_key_iv);
        this.setStoredValue(ENVIRONMENT_LOCATION, this.environment);
        this.setStoredValue(DEVICE_NAME_LOCATION, this.device_name);

        return true;
    }

    /**
     * Remove the API data but keeps the password
     * @param {boolean} resetStoredApiKey - removes currently selected api keys from storage aswell
     * @returns {Promise<void>}
     */
    public async destroyApiSession(resetStoredApiKey = false) {
        this.api_key = false;
        this.encrypted_api_key = false;
        this.encrypted_api_key_iv = false;

        if (resetStoredApiKey) {
            this.removeStoredValue(API_KEY_LOCATION);
            this.removeStoredValue(API_KEY_IV_LOCATION);
        }

        return this.BunqJSClient.destroyApiSession(resetStoredApiKey);
    }

    /**
     * Remove the API data and password from memory
     * @returns {Promise<void>}
     */
    public async destroySession() {
        this.api_key = false;
        this.encrypted_api_key = false;
        this.encrypted_api_key_iv = false;
        this.derived_password = false;

        this.removeStoredValue(API_KEY_LOCATION);
        this.removeStoredValue(API_KEY_IV_LOCATION);
        this.setStoredValue(USE_NO_PASSWORD_LOCATION, false);

        return this.BunqJSClient.destroySession();
    }

    /**
     * Overwrites the stored keys with a new list
     * @param storedApiKeys
     */
    public setStoredApiKeys(storedApiKeys) {
        this.stored_api_keys = storedApiKeys.sort(sortApiKeyList);
        this.setStoredValue(API_KEYS_LOCATION, this.stored_api_keys);
    }

    /**
     * Removes a single stored key by index
     * @param keyIndex
     */
    public removeStoredApiKey(keyIndex) {
        const storedApiKeys = this.storedApiKeys;
        storedApiKeys.splice(keyIndex, 1);

        this.stored_api_keys = storedApiKeys.sort(sortApiKeyList);
        this.setStoredValue(API_KEYS_LOCATION, this.stored_api_keys);
    }

    /**
     * Removes all stored api keys
     */
    public clearStoredApiKeys() {
        this.stored_api_keys = [];
        this.removeStoredValue(API_KEYS_LOCATION);
    }

    /**
     * Removes the password and optionally the salt value
     * @param {boolean} clearStorage - removes salt which will cause bunqDesktop to
     *                                  no longer be able to decrypt any of the
     *                                  currently encrypted data
     */
    public clearPassword(clearStorage = false) {
        if (clearStorage) {
            this.removeStoredValue(SALT_LOCATION);
            this.derived_password_salt = false;
        }

        this.derived_password = false;
        this.setStoredValue(USE_NO_PASSWORD_LOCATION, false);
    }

    /**
     * Decrypts the currently stored encrypted api key
     * @returns {Promise<string | false>}
     */
    private async decryptApiKey(): Promise<string | false> {
        const decryptedApiKey = await decryptString(
            this.encrypted_api_key,
            this.derived_password,
            this.encrypted_api_key_iv
        );

        if (!decryptedApiKey || decryptedApiKey.length !== 64) {
            this.Logger.error(`Failed to load API key: with length: ${decryptedApiKey.length}`);
            return false;
        }

        this.api_key = decryptedApiKey;
        return decryptedApiKey;
    }

    public async storeDecrypt(key: string, iv: any = false, type = "INDEXEDDB"): Promise<any> {
        return storeDecryptString(key, this.BunqJSClient.Session.encryptionKey, iv, type);
    }
    public async storeEncrypt(data: any, key: string, type = "INDEXEDDB"): Promise<any> {
        return storeEncryptString(data, key, this.BunqJSClient.Session.encryptionKey, type);
    }
    public storeRemove(key: string, type = "ALL"): void {
        if (type === "INDEXEDDB" || type === "ALL") this.IndexedDb.silentRemove(key);
        if (type === "LOCALSTORAGE" || type === "ALL") store.remove(key);

        // backup, attempt to delete IV value when possible
        if (!key.endsWith("_IV")) {
            const ivKey = `${key}_IV`;
            if (type === "INDEXEDDB" || type === "ALL") this.IndexedDb.silentRemove(ivKey);
            if (type === "LOCALSTORAGE" || type === "ALL") store.remove(ivKey);
        }
    }

    /** Getter functions **/
    get hasStoredApiKey(): boolean {
        return !!this.getStoredValue(API_KEY_LOCATION, false);
    }
    get hasStoredApiKeys(): boolean {
        return !!this.getStoredValue(API_KEYS_LOCATION, false);
    }
    get hasSkippedPassword(): boolean {
        return !!this.getStoredValue(USE_NO_PASSWORD_LOCATION, false);
    }

    get apiKey(): string | false {
        return this.api_key;
    }
    get derivedPassword(): string | false {
        return this.derived_password;
    }
    get derivedPasswordSalt(): string | false {
        return this.derived_password_salt;
    }
    get passwordIdentifier(): string | false {
        return this.password_identifier;
    }
    get encryptedApiKey(): string | false {
        return this.encrypted_api_key;
    }
    get encryptedApiKeyIv(): string | false {
        return this.encrypted_api_key_iv;
    }
    get deviceName(): string {
        return this.device_name;
    }
    get permittedIps(): string[] {
        return this.permitted_ips;
    }
    get storedApiKeys(): StoredApiKey[] {
        this.stored_api_keys = this.getStoredValue(API_KEYS_LOCATION, []);

        return this.stored_api_keys;
    }

    /** Storage handlers **/
    private getStoredValue(key: string, defaultValue: any = false): any {
        const storedValue = this.Store.get(key);
        return storedValue !== undefined ? storedValue : defaultValue;
    }
    private setStoredValue(key: string, value: any): void {
        this.Store.set(key, value);
    }
    private removeStoredValue(key: string): void {
        this.Store.remove(key);
    }
}

export default BunqDesktopClient;
