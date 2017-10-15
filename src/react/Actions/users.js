import axios from "axios";
import Utils from "../Helpers/Utils";
const Logger = require("../Helpers/Logger");

export function usersSetInfo(users) {
    return {
        type: "USERS_SET_INFO",
        payload: {
            users: users
        }
    };
}

export function usersUpdate() {
    return dispatch => {
        Logger.error("users api not implemented");
        // dispatch(usersLoading());
        // axios
        //     .get(`/api/users`)
        //     .then(response => response.data)
        //     .then(json => {
        //         if (Utils.validateJSON(json)) {
        //             dispatch(usersSetInfo(json.users));
        //         }
        //         dispatch(usersNotLoading());
        //         dispatch(usersInitialCheck());
        //     })
        //     .catch(err => {
        //         dispatch(usersNotLoading());
        //         dispatch(usersInitialCheck());
        //         Logger.trace(err);
        //     });
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
