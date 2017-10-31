const Logger = require("../Helpers/Logger");
import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { openModal } from "./modal";

export function requestInquirySetInfo(requestInquiry, account_id) {
    // return the action
    return {
        type: "REQUEST_INQUIRY_SET_INFO",
        payload: {
            requestInquiry: requestInquiry,
            account_id: account_id
        }
    };
}

/**
 * @param BunqJSClient
 * @param userId
 * @param accountId
 * @param description
 * @param amount
 * @param target
 * @param options
 * @returns {function(*=)}
 */
export function requestInquirySend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    target,
    options = {}
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

export function requestInquiryClear() {
    return { type: "REQUEST_INQUIRY_CLEAR" };
}
