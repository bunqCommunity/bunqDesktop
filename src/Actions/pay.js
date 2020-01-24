import BunqErrorHandler from "~functions/BunqErrorHandler";
import { paymentInfoUpdate } from "./payments";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "./share_invite_monetary_account_inquiries";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "./share_invite_monetary_account_responses";
import { actions as snackbarActions } from "~store/snackbar";
import { accountsUpdate } from "~store/accounts/thunks";

export function paySend(userId, accountId, description, amount, targets, draft = false) {
    const failedMessage = window.t("We received the following error while sending your payment");
    const successMessage1 = window.t("Draft payment successfully created!");
    const successMessage2 = window.t("Payments sent successfully!");
    const successMessage3 = window.t("Payment sent successfully!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(payLoading());

        const isMultiple = targets.length <= 1;

        const paymentTypeHandler = isMultiple ? BunqJSClient.api.payment : BunqJSClient.api.paymentBatch;

        const paymentHandler = draft
            ? // draft mode
              BunqJSClient.api.draftPayment
            : // regular payment
              paymentTypeHandler;

        const targetData = isMultiple ? targets.pop() : targets;

        paymentHandler
            .post(userId, accountId, description, amount, targetData)
            .then(() => {
                const notification = draft ? successMessage1 : isMultiple ? successMessage2 : successMessage3;

                dispatch(snackbarActions.open({ message: notification }));

                // update the payments, accounts and share list
                dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(userId));
                dispatch(accountsUpdate(userId));

                dispatch(payNotLoading());
            })
            .catch(error => {
                dispatch(payNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function paySchedule(userId, accountId, description, amount, targets, schedule) {
    const failedMessage = window.t("We received the following error while sending your payment");
    const successMessage1 = window.t("Payment was successfully scheduled!");
    const successMessage2 = window.t("Payments were successfully scheduled!");
    const BunqJSClient = window.BunqDesktopClient.BunqJSClient;

    return dispatch => {
        dispatch(payLoading());

        const isMultiple = targets.length <= 1;

        // for both use single or multiple payment handler
        const scheduleTypeHandler = isMultiple
            ? BunqJSClient.api.schedulePayment
            : BunqJSClient.api.schedulePaymentBatch;

        const payments = targets.map(target => {
            return {
                description: description,
                amount: amount,
                counterparty_alias: target
            };
        });

        const paymentData = isMultiple ? payments.pop() : payments;

        scheduleTypeHandler
            .post(userId, accountId, paymentData, schedule)
            .then(() => {
                const notification = isMultiple ? successMessage1 : successMessage2;
                dispatch(snackbarActions.open({ message: notification }));

                // update the payments, accounts and share list
                dispatch(paymentInfoUpdate(userId, accountId));
                dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId));
                dispatch(shareInviteMonetaryAccountResponsesInfoUpdate( userId));
                dispatch(accountsUpdate(userId));

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
