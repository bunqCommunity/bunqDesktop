const Logger = require("../Helpers/Logger");
import { openModal } from "./modal";
import { accountsClear } from "./accounts";
import { paymentInfoClear } from "./payment_info";
import { paymentsClear } from "./payments";

export function userSetInfo(user, type) {
    return {
        type: "USER_SET_INFO",
        payload: {
            user: user,
            user_type: type
        }
    };
}

export function userLogin(BunqJSClient, type, updated = false) {
    return dispatch => {
        dispatch(userLoading());
        BunqJSClient.getUser(type, updated)
            .then(user => {
                if (user !== undefined) {
                    dispatch(userSetInfo(user, type));
                }
                dispatch(userInitialCheck());
                dispatch(userNotLoading());
            })
            .catch(error => {
                Logger.error(error);
                dispatch(
                    openModal(
                        "We failed to load the information for a user",
                        "Something went wrong"
                    )
                );
                dispatch(userNotLoading());
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
