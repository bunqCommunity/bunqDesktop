import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { requestInquiryUpdate } from "./request_inquiry_info";
import { requestInquiryBatchesUpdate } from "./request_inquiry_batches";

export function requestInquirySend(BunqJSClient, userId, accountId, requestInquiries) {
    const failedMessage = window.t("We received the following error while sending your request");
    const successMessage = window.t("Request was sent successfully!");

    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiryBatch
            .post(userId, accountId, requestInquiries, false, {})
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(requestInquiryNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestInquiryCancel(BunqJSClient, userId, accountId, requestInquiryId) {
    const failedMessage = window.t("We received the following error while trying to cancel your request inquiry");
    const successMessage = window.t("Request was cancelled successfully!");

    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiry
            .put(userId, accountId, requestInquiryId, "REVOKED")
            .then(result => {
                dispatch(openSnackbar(successMessage));
                dispatch(requestInquiryNotLoading());

                // update the information page
                dispatch(requestInquiryUpdate(BunqJSClient, userId, accountId, requestInquiryId));
                dispatch(requestInquiryBatchesUpdate(BunqJSClient, userId, accountId));
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
