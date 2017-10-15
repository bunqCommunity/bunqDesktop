import { combineReducers } from "redux";

import registration from "./registration";
import modal from "./modal";
import snackbar from "./snackbar";
import user from "./user";
import users from "./users";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import accounts from "./accounts";

export default combineReducers({
    modal,
    snackbar,
    user,
    users,
    payments,
    registration,
    payment_info,
    payment_filter,
    accounts
});
