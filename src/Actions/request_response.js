import BunqErrorHandler from "~functions/BunqErrorHandler";
import { requestResponseUpdate } from "./request_response_info";
import { requestInquiryBatchesUpdate } from "./request_inquiry_batches";

import { actions as snackbarActions } from "~store/snackbar";

// Disabled until after 0.7 release
export function requestResponseAccept(
    userId,
    accountId,
    requestResponseId,
    amountResponded,
    options = {
        address_shipping: false,
        address_billing: false
    }
) {
    const failedMessage = window.t("We received the following error while trying to accept your request response");
    const successMessage = window.t("Request response was successfully accepted!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .put(userId, accountId, requestResponseId, "ACCEPTED", {
                address_billing: options.address_billing,
                address_shipping: options.address_shipping,
                amount_responded: amountResponded
            })
            .then(() => {
                dispatch([
                    snackbarActions.open({ message: successMessage }),
                    requestResponseNotLoading(),
                    requestResponseUpdate(userId, accountId, requestResponseId),
                    requestInquiryBatchesUpdate(userId, accountId),
                ]);
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestResponseReject(userId, accountId, requestResponseId) {
    const failedMessage = window.t("We received the following error while trying to cancel the request");
    const successMessage = window.t("Request was rejected successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .put(userId, accountId, requestResponseId, "REJECTED", {})
            .then(result => {
                dispatch(snackbarActions.open({ message: successMessage }));
                dispatch(requestResponseNotLoading());

                // update the information page
                dispatch(requestResponseUpdate(userId, accountId, requestResponseId));
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                // FIXME: restore
                // BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestResponseLoading() {
    return { type: "REQUEST_RESPONSE_IS_LOADING" };
}

export function requestResponseNotLoading() {
    return { type: "REQUEST_RESPONSE_IS_NOT_LOADING" };
}
