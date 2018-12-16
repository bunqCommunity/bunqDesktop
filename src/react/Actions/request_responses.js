import BunqErrorHandler from "../Functions/BunqErrorHandler";
import RequestResponse from "../Models/RequestResponse";

export const STORED_REQUEST_RESPONSES = "BUNQDESKTOP_STORED_REQUEST_RESPONSES";

export function requestResponsesSetInfo(requestResponses, account_id, resetOldItems = false, BunqJSClient = false) {
    const type = resetOldItems ? "REQUEST_RESPONSES_SET_INFO" : "REQUEST_RESPONSES_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            requestResponses,
            account_id
        }
    };
}

export function loadStoredRequestResponses(BunqJSClient) {
    return dispatch => {
        dispatch(requestResponsesLoading());
        const BunqDesktopClient = window.BunqDesktopClient;
        BunqDesktopClient.storeDecrypt(STORED_REQUEST_RESPONSES)
            .then(data => {
                if (data && data.items) {
                    const newRequestResponses = data.items.map(item => new RequestResponse(item));
                    dispatch(requestResponsesSetInfo(newRequestResponses, data.account_id));
                }
                dispatch(requestResponsesNotLoading());
            })
            .catch(error => {
                dispatch(requestResponsesNotLoading());
            });
    };
}

export function requestResponsesUpdate(
    BunqJSClient,
    userId,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We received the following error while loading your request responses");

    return dispatch => {
        dispatch(requestResponsesLoading());
        BunqJSClient.api.requestResponse
            .list(userId, accountId, options)
            .then(requestResponses => {
                const newRequestResponses = requestResponses.map(item => new RequestResponse(item));
                dispatch(requestResponsesSetInfo(newRequestResponses, accountId, false, BunqJSClient));
                dispatch(requestResponsesNotLoading());
            })
            .catch(error => {
                dispatch(requestResponsesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestResponsesLoading() {
    return { type: "REQUEST_RESPONSES_IS_LOADING" };
}

export function requestResponsesNotLoading() {
    return { type: "REQUEST_RESPONSES_IS_NOT_LOADING" };
}

export function requestResponsesClear() {
    return { type: "REQUEST_RESPONSES_CLEAR" };
}
