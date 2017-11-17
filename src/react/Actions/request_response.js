import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { requestResponseUpdate } from "./request_response_info";

// Disabled until after 0.7 release
// export function requestResponseSend(
//     BunqJSClient,
//     userId,
//     accountId,
//     description,
//     amount,
//     target,
//     options = {
//         status: false,
//         minimum_age: false,
//         allow_bunqme: false,
//         redirect_url: false
//     }
// ) {
//     return dispatch => {
//         dispatch(requestResponseLoading());
//         BunqJSClient.api.requestResponse
//             .post(userId, accountId, description, amount, target, options)
//             .then(result => {
//                 dispatch(openSnackbar("Request response sent successfully!"));
//                 dispatch(requestResponseNotLoading());
//             })
//             .catch(error => {
//                 dispatch(requestResponseNotLoading());
//                 BunqErrorHandler(
//                     dispatch,
//                     error,
//                     "We received the following error while sending your request response"
//                 );
//             });
//     };
// }

export function requestResponseReject(
    BunqJSClient,
    userId,
    accountId,
    requestResponseId
) {
    return dispatch => {
        dispatch(requestResponseLoading());
        BunqJSClient.api.requestResponse
            .put(userId, accountId, requestResponseId, "REJECTED", {})
            .then(result => {
                dispatch(openSnackbar("Request was rejected successfully!"));
                dispatch(requestResponseNotLoading());

                // update the information page
                dispatch(
                    requestResponseUpdate(
                        BunqJSClient,
                        userId,
                        accountId,
                        requestResponseId
                    )
                );
            })
            .catch(error => {
                dispatch(requestResponseNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while trying to cancel the request"
                );
            });
    };
}

export function requestResponseLoading() {
    return { type: "REQUEST_RESPONSE_IS_LOADING" };
}

export function requestResponseNotLoading() {
    return { type: "REQUEST_RESPONSE_IS_NOT_LOADING" };
}
