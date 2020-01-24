import store from "store";
import BunqErrorHandler from "~functions/BunqErrorHandler";

import { registrationClearUserInfo } from "./registration";
import { actions as snackbarActions } from "~store/snackbar";
import { usersUpdate } from "./users";

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

export function userUpdateImage(userId, attachmentId, userType = "UserPerson") {
    const failedMessage = window.t("We received the following error while updating the image for your account");
    const successMessage = window.t("Image updated successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        // make the image public
        BunqJSClient.api.avatar
            .post(attachmentId)
            .then(avatarUuid => {
                const putRequest = {
                    avatar_uuid: avatarUuid
                };

                let apiPromise;
                switch (userType) {
                    case "UserPerson":
                        apiPromise = BunqJSClient.api.userPerson.put(userId, putRequest);
                        break;
                    case "UserCompany":
                        apiPromise = BunqJSClient.api.userPerson.put(userId, putRequest);
                        break;
                }

                apiPromise
                    .then(() => {
                        dispatch(snackbarActions.open({ message: successMessage }));
                        dispatch(usersUpdate( true));
                    })
                    .catch(error => {
                        BunqErrorHandler(dispatch, error, failedMessage);
                    });
            })
            .catch(error => {
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}
