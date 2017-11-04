import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { paymentsUpdate } from "./payments";
import { accountsUpdate } from "./accounts";

export function paySend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    target
) {
    return dispatch => {
        dispatch(payLoading());
        BunqJSClient.api.payment
            .post(userId, accountId, description, amount, target)
            .then(result => {
                dispatch(openSnackbar("Payment sent successfully!"));
                dispatch(paymentsUpdate(BunqJSClient, userId, accountId));
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
