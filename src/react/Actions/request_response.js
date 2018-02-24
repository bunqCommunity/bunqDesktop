import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { requestResponseUpdate } from "./request_response_info";

// Disabled until after 0.7 release
export function requestResponseAccept(
    BunqJSClient,
    userId,
    accountId,
    requestResponseId,
    amountResponded,
    options = {
        address_shipping: false,
        address_billing: false
    }
) {
    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .put(userId, accountId, requestResponseId, "ACCEPTED", {
                address_billing: options.address_billing,
                address_shipping: options.address_shipping,
                amount_responded: amountResponded
            })
            .then(result => {
                dispatch(openSnackbar("Request response was successfully accepted!"));
                dispatch(requestResponseNotLoading());

                // update the information page
                dispatch(
                    requestResponseUpdate(
                        BunqJSClient,
                        userId,
                        accountId,
                        requestResponseId
                    )
                );
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while trying to accept your request response"
                );
            });
    };
}

export function requestResponseReject(
    BunqJSClient,
    userId,
    accountId,
    requestResponseId
) {
    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .put(userId, accountId, requestResponseId, "REJECTED", {})
            .then(result => {
                dispatch(openSnackbar("Request was rejected successfully!"));
                dispatch(requestResponseNotLoading());

                // update the information page
                dispatch(
                    requestResponseUpdate(
                        BunqJSClient,
                        userId,
                        accountId,
                        requestResponseId
                    )
                );
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while trying to cancel the request"
                );
            });
    };
}

export function requestResponseLoading() {
    return { type: "REQUEST_RESPONSE_IS_LOADING" };
}

export function requestResponseNotLoading() {
    return { type: "REQUEST_RESPONSE_IS_NOT_LOADING" };
}
