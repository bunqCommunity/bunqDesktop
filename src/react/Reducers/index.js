import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import amount_filter from "./amount_filter";
import account_id_filter from "./account_id_filter";
import accounts from "./accounts";
import application from "./application";
import bunq_me_tabs from "./bunq_me_tabs";
import bunq_me_tab_filter from "./bunq_me_tab_filter";
import bunq_me_tab from "./bunq_me_tab";
import categories from "./categories";
import category_filter from "./category_filter";
import cards from "./cards";
import card_cvc2 from "./card_cvc2";
import card_id_filter from "./card_id_filter";
import category_rules from "./category_rules.ts";
import contacts from "./contacts";
import date_filter from "./date_filter";
import export_new from "./export_new";
import exports from "./exports";
import general_filter from "./general_filter";
import modal from "./modal";
import master_card_actions from "./master_card_actions";
import master_card_action_info from "./master_card_action_info";
import note_texts from "./note_texts";
import oauth from "./oauth";
import options from "./options";
import pagination from "./pagination";
import pay from "./pay";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";
import pending_payments from "./pending_payments";
import queue from "./queue";
import registration from "./registration";
import request_filter from "./request_filter";
import request_inquiries from "./request_inquiries";
import request_inquiry from "./request_inquiry";
import request_inquiry_batches from "./request_inquiry_batches";
import request_inquiry_info from "./request_inquiry_info";
import request_responses from "./request_responses";
import request_response from "./request_response";
import request_response_info from "./request_response_info";
import scheduled_payments from "./scheduled_payments";
import savings_goals from "./savings_goals";
import search_filter from "./search_filter";
import share_invite_monetary_account_inquiries from "./share_invite_monetary_account_inquiries";
import share_invite_monetary_account_inquiry from "./share_invite_monetary_account_inquiry";
import share_invite_monetary_account_responses from "./share_invite_monetary_account_responses";
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
    bunq_me_tabs,
    categories,
    category_filter,
    cards,
    card_cvc2,
    card_id_filter,
    category_rules,
    contacts,
    date_filter,
    export_new,
    exports,
    form: formReducer,
    general_filter,
    modal,
    master_card_actions,
    master_card_action_info,
    note_texts,
    oauth,
    options,
    pagination,
    pay,
    payment_info,
    payment_filter,
    pending_payments,
    payments,
    queue,
    registration,
    request_filter,
    request_inquiries,
    request_inquiry,
    request_inquiry_batches,
    request_inquiry_info,
    request_responses,
    request_response,
    request_response_info,
    scheduled_payments,
    savings_goals,
    search_filter,
    share_invite_monetary_account_inquiries,
    share_invite_monetary_account_inquiry,
    share_invite_monetary_account_responses,
    snackbar,
    sidebar,
    user,
    users
});
