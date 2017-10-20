import store from "store";
import { derivePasswordKey } from "../Helpers/Crypto";
import Logger from "../Helpers/Logger";

const saltStorageLocation = "application_salt";
const apikeyStorageLocation = "application_apikey";

export function applicationSetDerivedPassword(derivedPassword) {
    return {
        type: "APPLICATION_SET_DERIVED_PASSWORD",
        payload: {
            derivedPassword: derivedPassword
        }
    };
}

export function applicationClearPassword() {
    return {
        type: "APPLICATION_CLEAR_PASSWORD"
    };
}

export function applicationDerivePassword(password) {
    return dispatch => {
        dispatch(applicationLoadingPassword());
        dispatch(
            applicationSetStatus("Creating a secure key from your password")
        );

        if(store.get("application_salt"))

        derivePasswordKey(password, false, 15000)
            .then(derivedPassword => {
                dispatch(applicationNotLoadingPassword());
                dispatch(applicationSetDerivedPassword(derivedPassword));
            })
            .catch(error => {
                Logger.error(error);
                dispatch(applicationNotLoadingPassword());
            });
    };
}

export function applicationSetStatus(status_message) {
    return {
        type: "APPLICATION_SET_STATUS_MESSAGE",
        payload: {
            status_message: status_message
        }
    };
}

/**
 * Currently loading/deriving the password
 * @returns {{type: string}}
 */
export function applicationLoadingPassword() {
    return {
        type: "APPLICATION_LOADING_PASSWORD"
    };
}

/**
 * Currently not loading/deriving the password
 * @returns {{type: string}}
 */
export function applicationNotLoadingPassword() {
    return {
        type: "APPLICATION_NOT_LOADING_PASSWORD"
    };
}
