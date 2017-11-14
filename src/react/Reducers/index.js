import { combineReducers } from "redux";

import application from "./application";
import accounts from "./accounts";
import bunq_me_tabs from "./bunq_me_tabs";
import bunq_me_tab from "./bunq_me_tab";
import modal from "./modal";
import user from "./user";
import users from "./users";
import registration from "./registration";
import snackbar from "./snackbar";
import theme from "./options";
import main_drawer from "./main_drawer";
import master_card_actions from "./master_card_actions";
import master_card_action_info from "./master_card_action_info";
import options from "./options";
import options_drawer from "./options_drawer";
import pay from "./pay";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import request_inquiries from "./request_inquiries";
import request_inquiry from "./request_inquiry";
import request_responses from "./request_responses";
import request_response_info from "./request_response_info";

export default combineReducers({
    application,
    accounts,
    bunq_me_tab,
    bunq_me_tabs,
    modal,
    user,
    users,
    registration,
    snackbar,
    theme,
    main_drawer,
    master_card_actions,
    master_card_action_info,
    options,
    options_drawer,
    pay,
    payment_info,
    payment_filter,
    payment_filter,
    payments,
    request_inquiries,
    request_inquiry,
    request_responses,
    request_response_info
});
