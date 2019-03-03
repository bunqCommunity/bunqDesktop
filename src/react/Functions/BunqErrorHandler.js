import Logger from "./Logger";

import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import { applicationSetOffline } from "../Actions/application";
import { registrationResetToApiScreen } from "../Actions/registration";

import ErrorCodes from "@bunq-community/bunq-js-client/dist/Helpers/ErrorCodes";

const defaultErrorMessage = (dispatch, customError = false) => {
    dispatch(
        openModal(
            customError ? customError : "Something went wrong while trying to send a request",
            "Something went wrong"
        )
    );
};

/**
 * @param dispatch
 * @param error
 * @param {boolean|string} customError
 * @param {boolean|BunqJSClient} BunqJSClient
 * @returns {*}
 */
export default (dispatch, error, customError = false, BunqJSClient = false) => {
    const response = error.response;

    const offlineError = window.t("We received a network error while trying to send a request! You might be offline");
    const invalidResponseError = window.t("We couldn't validate the response given by bunq!");
    const invalidAuthenticationError = window.t(
        "The API key or IP you are currently on is not valid for the selected bunq environment"
    );

    // log to logger
    Logger.error(response ? response.data : error.message);
    console.error(error);

    // check if a network error occured
    if (error.toString() === "Error: Network Error") {
        // show a less intrusive error using the snackbar
        dispatch(openSnackbar(offlineError));

        // enable offline mode
        dispatch(applicationSetOffline());
        return;
    }

    if (error.errorCode) {
        switch (error.errorCode) {
            // invalid response or it couldn't be verified
            case ErrorCodes.INVALID_RESPONSE_RECEIVED:
                return defaultErrorMessage(dispatch, invalidResponseError);
        }
    }

    // fallback to a default message
    if (!response) {
        return defaultErrorMessage(dispatch, customError);
    }

    // check if we can display a bunq error
    const contentType = response.headers["content-type"];

    // attempt to get response id from request
    const responseId = response.headers["x-bunq-client-response-id"];
    if (responseId) Logger.error(`Response-Id: ${responseId}`);

    // response was json so we can retrieve the error
    if (contentType && contentType.includes("application/json") && response.data.Error) {
        const errorObject = response.data.Error[0];

        // error contains an error description
        if (errorObject && errorObject.error_description) {
            const message =
                customError === false ? "We received the following error while sending a request to bunq" : customError;

            // add response id when possible
            const responseIdText = responseId ? `\n\nResponse-Id: ${responseId}` : "";

            // specific message based on api error description
            let errorMessage = errorObject.error_description;

            switch (errorObject.error_description) {
                case "User credentials are incorrect. Incorrect API key or IP address.":
                    errorMessage = invalidAuthenticationError;

                    // reset to api screen if possible
                    if (BunqJSClient) dispatch(registrationResetToApiScreen(BunqJSClient));
                    break;
            }

            return dispatch(openModal(`${message}:\n ${errorMessage}${responseIdText}`, "Something went wrong"));
        }
    }

    return defaultErrorMessage(dispatch, customError);
};
