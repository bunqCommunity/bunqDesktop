import BunqErrorHandler from "../Functions/BunqErrorHandler";
import { userSetInfo } from "./user";

export function usersUpdate(BunqJSClient, updated = false) {
    const failedMessage = window.t("We failed to load your users");

    return dispatch => {
        dispatch(usersLoading());
        BunqJSClient.getUsers(updated)
            .then(users => {
                const userType = Object.keys(users)[0];
                dispatch(userSetInfo(users[userType], userType));

                dispatch(usersNotLoading());
                dispatch(usersInitialCheck());
            })
            .catch(error => {
                dispatch(usersNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function usersLoading() {
    return { type: "USERS_IS_LOADING" };
}

export function usersNotLoading() {
    return { type: "USERS_IS_NOT_LOADING" };
}

export function usersInitialCheck() {
    return { type: "USERS_INITIAL_CHECK" };
}

export function usersClear() {
    return { type: "USERS_CLEAR" };
}
