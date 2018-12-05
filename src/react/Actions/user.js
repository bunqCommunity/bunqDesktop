import store from "store";
import { registrationClearUserInfo } from "./registration";

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
