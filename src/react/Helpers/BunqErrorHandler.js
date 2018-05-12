import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import Logger from "./Logger";
import { applicationSetOffline } from "../Actions/application";

const defaultErrorMessage = dispatch => {
    dispatch(
        openModal(
            "Something went wrong while trying to send a request",
            "Something went wrong"
        )
    );
};

/**
 * @param dispatch
 * @param error
 * @param customError
 * @returns {*}
 */
export default (dispatch, error, customError = false) => {
    const response = error.response;

    // log to logger
    Logger.error(response ? response.data : error.message);

    // check if a network error occured
    if (error.toString() === "Error: Network Error") {
        // show a less intrusive error using the snackbar
        dispatch(
            openSnackbar(
                "We received a network error while trying to send a request! You might be offline"
            )
        );

        // enable offline mode
        dispatch(applicationSetOffline());
        return;
    }

    // fallback to a default message
    if (!response) {
        return defaultErrorMessage(dispatch);
    }

    // check if we can display a bunq error
    const contentType = response.headers["content-type"];

    // response was json so we can retrieve the error
    if (contentType && contentType.includes("application/json")) {
        const errorObject = response.data.Error[0];

        // error contains an error description
        if (errorObject && errorObject.error_description) {
            const message =
                customError === false
                    ? "We received the following error while sending a request to bunq"
                    : customError;

            return dispatch(
                openModal(
                    `${message}: ${errorObject.error_description}`,
                    "Something went wrong"
                )
            );
        }
    }

    return defaultErrorMessage(dispatch);
};
