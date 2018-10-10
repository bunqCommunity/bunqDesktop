import store from "store";
import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { accountsClear } from "./accounts";
import { paymentInfoClear } from "./payment_info";
import { paymentsClear } from "./payments";
import { requestResponseClear } from "./request_response_info";
import { requestInquiryClear } from "./request_inquiry_info";
import { bunqMeTabsClear } from "./bunq_me_tabs";
import { registrationClearUserInfo, registrationSetOAuthStoredApiKey } from "./registration";

const USER_ID_LOCATION = "BUNQDESKTOP_USER_ID";

export function userSetInfo(user, type) {
    return dispatch => {
        const storedUserId = store.get(USER_ID_LOCATION);

        // check if a previous id was stored and check if id is different
        if (!storedUserId || user.id !== storedUserId) {
            dispatch(registrationClearUserInfo());
        }

        // set new user id in localStorage
        store.set(USER_ID_LOCATION, user.id);

        dispatch({
            type: "USER_SET_INFO",
            payload: {
                user: user,
                user_type: type
            }
        });
    };
}

export function userLogin(BunqJSClient, type, updated = false) {
    const failedMessage = window.t("We failed to load the information for this user");

    return dispatch => {
        dispatch(userLoading());
        BunqJSClient.getUser(type, updated)
            .then(user => {
                if (user && user !== undefined) {
                    // if of UserApiKey type, attempt to mark this key as OAuth in the stored api keys
                    if (type === "UserApiKey") {
                        dispatch(registrationSetOAuthStoredApiKey());
                    }

                    dispatch(userSetInfo(user, type));
                }
                dispatch(userInitialCheck());
                dispatch(userNotLoading());
            })
            .catch(error => {
                dispatch(userNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function userLogout() {
    return dispatch => {
        // logout the user
        dispatch({
            type: "USER_LOGOUT"
        });

        // user was deselected so we clear the info for this user
        dispatch(accountsClear());
        dispatch(paymentInfoClear());
        dispatch(paymentsClear());
        dispatch(bunqMeTabsClear());
        dispatch(requestResponseClear());
        dispatch(requestInquiryClear());
    };
}

export function userLoading() {
    return { type: "USER_IS_LOADING" };
}

export function userNotLoading() {
    return { type: "USER_IS_NOT_LOADING" };
}

export function userInitialCheck() {
    return { type: "USER_INITIAL_CHECK" };
}

export function userClear() {
    return { type: "USER_CLEAR" };
}
