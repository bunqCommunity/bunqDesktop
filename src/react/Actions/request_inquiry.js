import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";

export function requestInquirySend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    target,
    options = {
        status: false,
        minimum_age: false,
        allow_bunqme: false,
        redirect_url: false
    }
) {
    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiry
            .post(userId, accountId, description, amount, target, options)
            .then(result => {
                dispatch(openSnackbar("Request inquiry sent successfully!"));
                dispatch(requestInquiryNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while sending your request inquiry"
                );
            });
    };
}

export function requestInquiryLoading() {
    return { type: "REQUEST_INQUIRY_IS_LOADING" };
}

export function requestInquiryNotLoading() {
    return { type: "REQUEST_INQUIRY_IS_NOT_LOADING" };
}
