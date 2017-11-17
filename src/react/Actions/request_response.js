// import BunqErrorHandler from "../Helpers/BunqErrorHandler";
// import { openSnackbar } from "./snackbar";

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
//
// export function requestResponseLoading() {
//     return { type: "REQUEST_RESPONSE_IS_LOADING" };
// }
//
// export function requestResponseNotLoading() {
//     return { type: "REQUEST_RESPONSE_IS_NOT_LOADING" };
// }
