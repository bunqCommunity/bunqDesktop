import BunqJSClient from "@bunq-community/bunq-js-client";
import { decryptString, derivePasswordKey, encryptString } from "./Helpers/Crypto";

export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEYS_LOCATION = "BUNQDESKTOP_API_KEYS";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";

export const USE_NO_PASSWORD_LOCATION = "USE_NO_PASSWORD_LOCATION";
export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const DEFAULT_PASSWORD = "SOME_DEFAULT_PASSWORD";

export type Environment = "PRODUCTION" | "SANDBOX";

export type StoredApiKey = {
    identifier: string | false;
    api_key: string;
    api_key_iv: string;
    permitted_ips: string[];
    device_name: string;
    environment: Environment;
    // helps mark keys as OAuth for UI purposes
    isOAuth: boolean;
};

class BunqDesktopClient {
    private BunqJSClient: BunqJSClient;
    private Logger: any;
    private Store: any;

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

    constructor(BunqJSClient, Logger, Store) {
        this.BunqJSClient = BunqJSClient;
        this.Logger = Logger;
        this.Store = Store;

        // current session data if it exists
        this.device_name = this.getStoredValue(DEVICE_NAME_LOCATION, "My device");
        this.encrypted_api_key = this.getStoredValue(API_KEY_LOCATION, false);
        this.encrypted_api_key_iv = this.getStoredValue(API_KEY_IV_LOCATION, false);
        this.environment = this.getStoredValue(ENVIRONMENT_LOCATION, "PRODUCTION");
        this.stored_api_keys = this.getStoredValue(API_KEYS_LOCATION, []);
    }

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

    public async BunqJSClientRegisterGetUsers() {
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
     * Loads an API key from the stored api key list based on its index
     * @param {number} keyIndex
     * @returns {Promise<boolean>}
     */
    // public async switchStoredApiKey(keyIndex: number): Promise<boolean> {
    //     const storedApiKeys = this.getStoredValue(API_KEYS_LOCATION);
    //     if (!storedApiKeys) {
    //         // no api key stored
    //         return false;
    //     }
    //     this.stored_api_keys = storedApiKeys;
    //
    //     // get currently stored api key
    //     if (this.stored_api_keys.length === 0 || !this.stored_api_keys[keyIndex]) {
    //         // no api key stored on this index
    //         this.Logger.error(
    //             `No stored API keys or index not found (index: ${keyIndex}) in storedKeys ${
    //                 this.stored_api_keys.length
    //             }`
    //         );
    //         return false;
    //     }
    //
    //     const storedApiKeyInfo = this.stored_api_keys[keyIndex];
    //     this.encrypted_api_key = storedApiKeyInfo.api_key;
    //     this.encrypted_api_key_iv = storedApiKeyInfo.api_key_iv;
    //     this.environment = storedApiKeyInfo.environment;
    //     this.device_name = storedApiKeyInfo.device_name;
    //     this.permitted_ips = storedApiKeyInfo.permitted_ips;
    //
    //     // overwrite currently stored encrypted API key/iv, device name and environment
    //     this.setStoredValue(API_KEY_LOCATION, this.encrypted_api_key);
    //     this.setStoredValue(API_KEY_IV_LOCATION, this.encrypted_api_key_iv);
    //     this.setStoredValue(ENVIRONMENT_LOCATION, this.environment);
    //     this.setStoredValue(DEVICE_NAME_LOCATION, this.device_name);
    //
    //     // attempt to decrypt the stored API key
    //     const decryptionSuccess = await this.decryptApiKey();
    //
    //     return !!decryptionSuccess;
    // }

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

        if (decryptedApiKey.length !== 64) {
            this.Logger.error(`Failed to load API key: with length: ${decryptedApiKey.length}`);
            return false;
        }

        this.api_key = decryptedApiKey;
        return decryptedApiKey;
    }

    /**
     * Remove the API data but keeps the password
     * @param {boolean} save
     * @returns {Promise<void>}
     */
    public async destroyApiSession(save = false) {
        this.api_key = false;
        this.encrypted_api_key = false;
        this.encrypted_api_key_iv = false;
        this.derived_password = false;
        return this.BunqJSClient.destroyApiSession(save);
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
        this.derived_password = false;
        return this.BunqJSClient.destroySession();
    }

    public setStoredApiKeys(storedApiKeys) {
        this.stored_api_keys = storedApiKeys;
        this.setStoredValue(API_KEYS_LOCATION, this.stored_api_keys);
    }
    public removeStoredApiKey(keyIndex) {
        const storedApiKeys = this.storedApiKeys;
        storedApiKeys.splice(keyIndex, 1);

        this.setStoredValue(API_KEYS_LOCATION, storedApiKeys);
        this.stored_api_keys = storedApiKeys;
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
