import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import amount_filter from "./amount_filter";
import account_id_filter from "./account_id_filter";
import accounts from "./accounts";
import application from "./application";
import bunq_me_tab_filter from "./bunq_me_tab_filter";
import bunq_me_tab from "./bunq_me_tab";
import categories from "./categories";
import category_filter from "./category_filter";
import cards from "./cards";
import card_cvc2 from "./card_cvc2";
import category_rules from "./category_rules.ts";
import contacts from "./contacts";
import date_filter from "./date_filter";
import events from "./events";
import export_new from "./export_new";
import exports from "./exports";
import general_filter from "./general_filter";
import modal from "./modal";
import master_card_action_info from "./master_card_action_info";
import note_texts from "./note_texts";
import oauth from "./oauth";
import options from "./options";
import pagination from "./pagination";
import pay from "./pay";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import pending_payments from "./pending_payments";
import queue from "./queue";
import registration from "./registration";
import request_filter from "./request_filter";
import request_inquiry from "./request_inquiry";
import request_inquiry_info from "./request_inquiry_info";
import request_response from "./request_response";
import request_response_info from "./request_response_info";
import scheduled_payments from "./scheduled_payments";
import savings_goals from "./savings_goals";
import search_filter from "./search_filter";
import share_invite_bank_inquiries from "./share_invite_bank_inquiries";
import share_invite_bank_inquiry from "./share_invite_bank_inquiry";
import share_invite_bank_responses from "./share_invite_bank_responses";
import snackbar from "./snackbar";
import sidebar from "./sidebar";
import user from "./user";
import users from "./users";

export default combineReducers({
    amount_filter,
    account_id_filter,
    accounts,
    application,
    bunq_me_tab,
    bunq_me_tab_filter,
    categories,
    category_filter,
    cards,
    card_cvc2,
    category_rules,
    contacts,
    date_filter,
    events,
    export_new,
    exports,
    form: formReducer,
    general_filter,
    modal,
    master_card_action_info,
    note_texts,
    oauth,
    options,
    pagination,
    pay,
    payment_info,
    payment_filter,
    pending_payments,
    queue,
    registration,
    request_filter,
    request_inquiry,
    request_inquiry_info,
    request_response,
    request_response_info,
    scheduled_payments,
    savings_goals,
    search_filter,
    share_invite_bank_inquiries,
    share_invite_bank_inquiry,
    share_invite_bank_responses,
    snackbar,
    sidebar,
    user,
    users
});
