import { openModal } from "../Actions/modal";
import Logger  from "./Logger";

const defaultErrorMessage = dispatch => {
    dispatch(
        openModal(
            "Something went wrong while trying to send your request inquiry",
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
    Logger.error(error.toString());
    Logger.error(error.response.data);

    if (!error.response) {
        return defaultErrorMessage(dispatch);
    }

    const response = error.response;

    // check if we can display a bunq error
    const contentType = response.headers["content-type"];

    // response was json so we can retrieve the error
    if (contentType && contentType.includes("application/json")) {
        const errorObject = response.data.Error[0];

        // error contains an error description
        if (errorObject && errorObject.error_description) {
            const message =
                customError === false
                    ? "We received the following error while sending a request to Bunq"
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
