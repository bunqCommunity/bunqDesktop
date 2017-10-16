import { paymentInfoClear } from "./payment_info";
import { paymentsClear } from "./payments";
import { usersClear } from "./users";
import { accountsClear } from "./accounts";

export function userSetInfo(user) {
    return {
        type: "USER_SET_INFO",
        payload: {
            user: user
        }
    };
}

export function userLogin(BunqJSClient, type, updated = false) {
    return dispatch => {
        dispatch(userLoading());
        BunqJSClient.getUser(type, updated).then(user => {
            dispatch(userNotLoading());
            dispatch(userInitialCheck());
            if (user !== undefined) {
                dispatch(userSetInfo(user));
            }
        });
    };
}

export function userLogout() {
    return dispatch => {
        // logout the user
        dispatch({
            type: "USER_LOGOUT"
        });
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
