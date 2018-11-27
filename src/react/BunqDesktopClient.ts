import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client/src/BunqJSClient";
import Logger from "./Helpers/Logger";
import { decryptString, derivePasswordKey } from "./Helpers/Crypto";

export const SKIP_PASSWORD_LOCATION = "USE_NO_PASSWORD_LOCATION";

// The currently stored API keys containing plain text device names/environments and a encrypted api key and its IV value
export const API_KEYS_LOCATION = "BUNQDESKTOP_API_KEYS";

// info for current session
export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";
export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const DEFAULT_PASSWORD = "SOME_DEFAULT_PASSWORD";

export default class BunqDesktopClient {
    private BunqJSClient: BunqJSClient;
    private Logger: any;

    private api_key: string | false = false;
    private encrypted_api_key: string | false = false;
    private encrypted_api_key_iv: string | false = false;

    private stored_api_keys: string[] = [];

    private permitted_ips: string[] = [];
    private environment: "PRODUCTION" | "SANDBOX" = "PRODUCTION";
    private device_name: string = "My device";

    private derived_password: string | false = false;
    private derived_password_salt: string | false = false;
    private password_identifier: string | false = false;

    public constructor(BunqJSClient, CustomLogger = Logger) {
        this.BunqJSClient = BunqJSClient;
        this.Logger = CustomLogger;

        this.device_name = this.getStoredValue(DEVICE_NAME_LOCATION, "My device");
        this.stored_api_keys = this.getStoredValue(API_KEYS_LOCATION, []);
    }

    /**
     * Sets the password and calcualtes the derived password and its salt/identifier
     * @param {string} password
     * @returns {Promise<void>}
     */
    public async setupPassword(password: string) {
        // get the stored salt or fallback to false
        const salt = this.getStoredValue(SALT_LOCATION, false);

        // derive the password itself
        const derivedPassword = await derivePasswordKey(password, salt, 250000);
        // create a quick identifier based on this exact key
        const derivedIdentifier = await derivePasswordKey(derivedPassword.key + "identifier", salt, 100000);

        this.derived_password = derivedPassword.key;
        this.derived_password_salt = derivedPassword.salt;
        this.password_identifier = derivedIdentifier.key;
    }

    public async skipPassword() {
        // mark the password as "skipped" where the default password is used
        this.setStoredValue(SKIP_PASSWORD_LOCATION, true);

        // go through the standard flow
        return this.setupPassword(DEFAULT_PASSWORD);
    }

    public async login() {}

    public async loadStoredApiKey(keyIndex: number) {
        if (!store.get(API_KEYS_LOCATION)) {
            // no api key stored
            return false;
        }

        // get currently stored api key
        const encryptedApiKeys = store.get(API_KEYS_LOCATION);
        if (!encryptedApiKeys || !encryptedApiKeys[keyIndex]) {
            // no api key stored on this index
            return false;
        }

        const storedApiKeyInfo = encryptedApiKeys[keyIndex];
        const encryptedApiKey = storedApiKeyInfo.api_key;
        const storedApiKeyIV = storedApiKeyInfo.api_key_iv;
        const storedEnvironment = storedApiKeyInfo.environment;
        const storedDeviceName = storedApiKeyInfo.device_name;
        const storedPermittedIps = storedApiKeyInfo.permitted_ips;

        const decryptedString = await decryptString(encryptedApiKey, this.derived_password, storedApiKeyIV);

        // validate decrypted result
        if (decryptedString.length !== 64) {
            // clear the password so the user can try again
            // TODO handle failure
            this.Logger.error(`Failed to load API key: with length: ${decryptedString.length}`);

            return;
        }

        // overwrite currently stored encrypted API key/iv, device name and environment
        this.setStoredValue(API_KEY_LOCATION, encryptedApiKey);
        this.setStoredValue(API_KEY_IV_LOCATION, storedApiKeyIV);
        this.setStoredValue(ENVIRONMENT_LOCATION, storedEnvironment);
        this.setStoredValue(DEVICE_NAME_LOCATION, storedDeviceName);

        // set the loaded data in the object
        this.api_key = decryptedString;
        this.encrypted_api_key = storedApiKeyInfo.api_key;
        this.encrypted_api_key_iv = storedApiKeyInfo.api_key_iv;
        this.environment = storedApiKeyInfo.environment;
        this.device_name = storedApiKeyInfo.device_name;
        this.permitted_ips = storedApiKeyInfo.permitted_ips;
    }

    /** Getter help functions **/
    get hasStoredApiKey(): boolean {
        return this.getStoredValue(API_KEY_LOCATION, false);
    }
    get hasSkippedPassword(): boolean {
        return this.getStoredValue(SKIP_PASSWORD_LOCATION, false);
    }

    /** Storage handlers **/
    private getStoredValue(key: string, defaultValue: any = false): any {
        const storedValue = store.get(key);
        return storedValue !== undefined ? storedValue : defaultValue;
    }
    private setStoredValue(key: string, value: any): void {
        store.set(key, value);
    }
    private removeStoredValue(key: string): void {
        store.remove(key);
    }
}
