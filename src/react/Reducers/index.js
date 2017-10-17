import { combineReducers } from "redux";

import accounts from "./accounts";
import modal from "./modal";
import user from "./user";
import users from "./users";
import registration from "./registration";
import snackbar from "./snackbar";
import theme from "./theme";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";

export default combineReducers({
    accounts,
    modal,
    user,
    users,
    registration,
    snackbar,
    theme,
    payment_info,
    payment_filter,
    payment_filter,
    payments
});
