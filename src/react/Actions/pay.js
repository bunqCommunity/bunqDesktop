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
    targets,
    draft = false
) {
    const failedMessage = window.t(
        "We received the following error while sending your payment"
    );
    const successMessage1 = window.t("Draft payment successfully created!");
    const successMessage2 = window.t("Payments sent successfully!");
    const successMessage3 = window.t("Payment sent successfully!");

    return dispatch => {
        dispatch(payLoading());

        const isMultiple = targets.length <= 1;

        // use payment handler based on options
        const paymentHandler = draft
            ? BunqJSClient.api.draftPayment
            : isMultiple
              ? // use default payment endpoint or batch payment
                BunqJSClient.api.payment
              : BunqJSClient.api.paymentBatch;

        const targetData = isMultiple ? targets.pop() : targets;

        paymentHandler
            .post(userId, accountId, description, amount, targetData)
            .then(result => {
                const notification = draft
                    ? successMessage1
                    : isMultiple ? successMessage2 : successMessage3;

                dispatch(openSnackbar(notification));
                dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId));
                dispatch(accountsUpdate(BunqJSClient, userId));
                dispatch(payNotLoading());
            })
            .catch(error => {
                dispatch(payNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function payLoading() {
    return { type: "PAY_IS_LOADING" };
}

export function payNotLoading() {
    return { type: "PAY_IS_NOT_LOADING" };
}
