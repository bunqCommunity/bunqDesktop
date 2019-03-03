import BunqErrorHandler from "../Functions/BunqErrorHandler";
import RequestResponse from "../Models/RequestResponse";

import { requestResponsesSetInfo } from "./request_responses";

export function requestResponseSetInfo(request_response_info, account_id, request_response_id) {
    return {
        type: "REQUEST_RESPONSE_INFO_SET_INFO",
        payload: {
            request_response_info: request_response_info,
            request_response_id: request_response_id,
            account_id: account_id
        }
    };
}

export function requestResponseUpdate(BunqJSClient, user_id, account_id, request_response_id) {
    const failedMessage = window.t("We failed to load the request information");

    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .get(user_id, account_id, request_response_id)
            .then(requestResponse => {
                const requestResponseInfo = new RequestResponse(requestResponse);
                // update this item in the list and the stored data
                dispatch(requestResponsesSetInfo([requestResponseInfo], parseInt(account_id), false, BunqJSClient));

                dispatch(requestResponseSetInfo(requestResponseInfo, parseInt(account_id), request_response_id));
                dispatch(requestResponseNotLoading());
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestResponseLoading() {
    return { type: "REQUEST_RESPONSE_INFO_IS_LOADING" };
}

export function requestResponseNotLoading() {
    return { type: "REQUEST_RESPONSE_INFO_IS_NOT_LOADING" };
}

export function requestResponseClear() {
    return { type: "REQUEST_RESPONSE_INFO_CLEAR" };
}
