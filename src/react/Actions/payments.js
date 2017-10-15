import axios from "axios";
import Utils from "../Helpers/Utils";
const Logger = require("../Helpers/Logger");

export function paymentsSetInfo(payments, account_id) {
    // return the action
    return {
        type: "PAYMENTS_SET_INFO",
        payload: {
            payments: payments,
            account_id: account_id
        }
    };
}

export function paymentsUpdate(account_id) {
    return dispatch => {
        Logger.error("payments list api not implemented");
        // dispatch(paymentsLoading());
        // axios
        //     .get(`/api/payments/${account_id}`)
        //     .then(response => response.data)
        //     .then(json => {
        //         if (Utils.validateJSON(json)) {
        //             // update payments info and stop loading state
        //             dispatch(paymentsSetInfo(json, account_id));
        //         }
        //         dispatch(paymentsNotLoading());
        //     })
        //     .catch(err => {
        //         Logger.trace(err);
        //         dispatch(paymentsNotLoading());
        //     });
    };
}

export function paymentsLoading() {
    return { type: "PAYMENTS_IS_LOADING" };
}

export function paymentsNotLoading() {
    return { type: "PAYMENTS_IS_NOT_LOADING" };
}

export function paymentsClear() {
    return { type: "PAYMENTS_CLEAR" };
}
