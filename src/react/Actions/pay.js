import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { paymentInfoUpdate } from "./payments";
import { accountsUpdate } from "./accounts";

export function paySend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    target,
    draft = false
) {
    return dispatch => {
        dispatch(payLoading());
        const paymentHandler = draft
            ? BunqJSClient.api.draftPayment
            : BunqJSClient.api.payment;

        paymentHandler
            .post(userId, accountId, description, amount, target)
            .then(result => {
                const notification = draft
                    ? "Draft payment successfully created!"
                    : "Payment sent successfully!";
                dispatch(openSnackbar(notification));
                dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(payNotLoading());
            })
            .catch(error => {
                dispatch(payNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while sending your payment"
                );
            });
    };
}

export function payLoading() {
    return { type: "PAY_IS_LOADING" };
}

export function payNotLoading() {
    return { type: "PAY_IS_NOT_LOADING" };
}
