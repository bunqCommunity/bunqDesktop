import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client/src/BunqJSClient";
import Logger from "./Helpers/Logger";
import { derivePasswordKey } from "./Helpers/Crypto";
import { USE_NO_PASSWORD_LOCATION } from "./Reducers/registration";

export const SALT_LOCATION = "BUNQDESKTOP_PASSWORD_SALT";
export const API_KEY_LOCATION = "BUNQDESKTOP_API_KEY";
export const API_KEYS_LOCATION = "BUNQDESKTOP_API_KEYS";
export const API_KEY_IV_LOCATION = "BUNQDESKTOP_API_IV";
export const SKIP_PASSWORD_LOCATION = "USE_NO_PASSWORD_LOCATION";
export const DEVICE_NAME_LOCATION = "BUNQDESKTOP_DEVICE_NAME";
export const ENVIRONMENT_LOCATION = "BUNQDESKTOP_ENVIRONMENT";

const DEFAULT_PASSWORD = "SOME_DEFAULT_PASSWORD";

export default class BunqDesktopClient {
    private BunqJSClient: BunqJSClient;
    private Logger: any;

    private api_key: string | false = false;
    private encrypted_api_key: string | false = false;

    private stored_api_keys: string[] = [];

    private permitted_ips: string[] = [];
    private environment: "PRODUCTION" | "SANDBOX" = "PRODUCTION";
    private device_name: string = "My device";

    private derived_password: string | false = false;
    private derived_password_salt: string | false = false;
    private password_identifier: string | false = false;

    public constructor(BunqJSClient, Logger) {
        this.BunqJSClient = BunqJSClient;
        this.Logger = Logger;

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
        this.setStoredValue(USE_NO_PASSWORD_LOCATION, true);

        // go through the standard flow
        return this.setupPassword(DEFAULT_PASSWORD);
    }

    public async tester(){

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
