import BunqErrorHandler from "~functions/BunqErrorHandler";
import { requestInquiryUpdate } from "./request_inquiry_info";
import { requestInquiryBatchesUpdate } from "./request_inquiry_batches";
import { actions as snackbarActions } from "~store/snackbar";

export function requestInquirySend(userId, accountId, requestInquiries) {
    const failedMessage = window.t("We received the following error while sending your request");
    const successMessage = window.t("Request was sent successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiryBatch
            .post(userId, accountId, requestInquiries, false, {})
            .then(result => {
                dispatch(snackbarActions.open({ message: successMessage }));
                dispatch(requestInquiryNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                // FIXME
                // BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestInquiryCancel(userId, accountId, requestInquiryId) {
    const failedMessage = window.t("We received the following error while trying to cancel your request inquiry");
    const successMessage = window.t("Request was cancelled successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiry
            .put(userId, accountId, requestInquiryId, "REVOKED")
            .then(() => {
                dispatch(snackbarActions.open({ message: successMessage }));
                dispatch(requestInquiryNotLoading());

                // update the information page
                dispatch(requestInquiryUpdate(userId, accountId, requestInquiryId));
                dispatch(requestInquiryBatchesUpdate(userId, accountId));
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestInquiryLoading() {
    return { type: "REQUEST_INQUIRY_IS_LOADING" };
}

export function requestInquiryNotLoading() {
    return { type: "REQUEST_INQUIRY_IS_NOT_LOADING" };
}
