import { combineReducers } from "redux";

import application from "./application";
import accounts from "./accounts";
import bunq_me_tabs from "./bunq_me_tabs";
import modal from "./modal";
import user from "./user";
import users from "./users";
import registration from "./registration";
import snackbar from "./snackbar";
import theme from "./options";
import main_drawer from "./main_drawer";
import options from "./options";
import options_drawer from "./options_drawer";
import pay from "./pay";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import request_inquiries from "./request_inquiries";
import request_inquiry from "./request_inquiry";

export default combineReducers({
    application,
    accounts,
    bunq_me_tabs,
    modal,
    user,
    users,
    registration,
    snackbar,
    theme,
    main_drawer,
    options,
    options_drawer,
    pay,
    payment_info,
    payment_filter,
    payment_filter,
    payments,
    request_inquiries,
    request_inquiry
});
