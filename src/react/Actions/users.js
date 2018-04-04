import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function usersSetInfo(users) {
    return {
        type: "USERS_SET_INFO",
        payload: {
            users: users
        }
    };
}

export function usersUpdate(BunqJSClient, updated = false) {
    const failedMessage = window.t("We failed to load your users");

    return dispatch => {
        dispatch(usersLoading());
        BunqJSClient.getUsers(updated)
            .then(users => {
                dispatch(usersSetInfo(users));
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
