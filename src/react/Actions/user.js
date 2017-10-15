import axios from "axios";
import Utils from "../Helpers/Utils";
const Logger = require("../Helpers/Logger");

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

export function userLogin(id, type) {
    return dispatch => {
        Logger.error("login api not implemented");
        // dispatch(userLoading());
        // axios
        //     .post("/api/login", {
        //         id: id,
        //         type: type
        //     })
        //     .then(response => response.data)
        //     .then(json => {
        //         if (Utils.validateJSON(json)) {
        //             dispatch(userSetInfo(json.user));
        //         }
        //         dispatch(userNotLoading());
        //     })
        //     .catch(err => {
        //         Logger.trace(err);
        //         dispatch(userNotLoading());
        //     });
    };
}

export function userLogout() {
    return dispatch => {
        // logout the user
        dispatch({
            type: "USER_LOGOUT"
        });
        // clear info from most reducers
        dispatch(paymentInfoClear());
        dispatch(accountsClear());
        dispatch(paymentsClear());
        dispatch(usersClear());
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
