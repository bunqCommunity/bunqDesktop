export function usersSetInfo(users) {
    return {
        type: "USERS_SET_INFO",
        payload: {
            users: users
        }
    };
}

export function usersUpdate(BunqJSClient, updated = false) {
    return dispatch => {
        dispatch(usersLoading());
        BunqJSClient.getUsers(updated).then(users => {
            dispatch(usersNotLoading());
            dispatch(usersInitialCheck());
            dispatch(usersSetInfo(users));
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
