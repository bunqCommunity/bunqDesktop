import { openSnackbar } from "./snackbar";

const Logger = require("../Helpers/Logger");
import { openModal } from "./modal";

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
                dispatch(payNotLoading());
            })
            .catch(error => {
                Logger.error(error.toString());
                Logger.error(error.response.data);
                dispatch(payNotLoading());

                const response = error.response;

                // check if we can display a bunq error
                const contentType = response.headers["content-type"];
                if (contentType && contentType.includes("application/json")) {
                    const errorObject = response.data.Error[0];
                    if (errorObject && errorObject.error_description) {
                        return dispatch(
                            openModal(
                                `We received the following error while sending your payment: <br/>
                                ${errorObject.error_description}`,
                                "Something went wrong"
                            )
                        );
                    }
                }
                dispatch(
                    openModal(
                        "Something went wrong while trying to send your payment request",
                        "Something went wrong"
                    )
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
