import { combineReducers } from "redux";

import accounts from "./accounts";
import application from "./application";
import bunq_me_tabs from "./bunq_me_tabs";
import bunq_me_tab_filter from "./bunq_me_tab_filter";
import bunq_me_tab from "./bunq_me_tab";
import categories from "./categories";
import category_filter from "./category_filter";
import cards from "./cards";
import card_cvc2 from "./card_cvc2";
import category_rules from "./category_rules.ts";
import contacts from "./contacts";
import date_filter from "./date_filter";
import export_new from "./export_new";
import exports from "./exports";
import general_filter from "./general_filter";
import modal from "./modal";
import user from "./user";
import users from "./users";
import registration from "./registration";
import request_filter from "./request_filter";
import snackbar from "./snackbar";
import theme from "./theme";
import main_drawer from "./main_drawer";
import master_card_actions from "./master_card_actions";
import master_card_action_info from "./master_card_action_info";
import options from "./options";
import pagination from "./pagination";
import pay from "./pay";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import request_inquiries from "./request_inquiries";
import request_inquiry from "./request_inquiry";
import request_inquiry_info from "./request_inquiry_info";
import request_responses from "./request_responses";
import request_response from "./request_response";
import request_response_info from "./request_response_info";
import scheduled_payments from "./scheduled_payments";
import share_invite_bank_inquiries from "./share_invite_bank_inquiries";
import share_invite_bank_responses from "./share_invite_bank_responses";
import search_filter from "./search_filter";

export default combineReducers({
    accounts,
    application,
    bunq_me_tab,
    bunq_me_tab_filter,
    bunq_me_tabs,
    categories,
    category_filter,
    cards,
    card_cvc2,
    category_rules,
    contacts,
    date_filter,
    export_new,
    exports,
    general_filter,
    modal,
    main_drawer,
    master_card_actions,
    master_card_action_info,
    options,
    pagination,
    pay,
    payment_info,
    payment_filter,
    payments,
    registration,
    request_filter,
    request_inquiries,
    request_inquiry,
    request_inquiry_info,
    request_responses,
    request_response,
    request_response_info,
    scheduled_payments,
    search_filter,
    share_invite_bank_inquiries,
    share_invite_bank_responses,
    snackbar,
    theme,
    user,
    users
});
