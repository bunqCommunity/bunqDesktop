import { configureStore, getDefaultMiddleware, ThunkAction } from "@reduxjs/toolkit";
import { AnyAction, Dispatch } from "redux";
import createSagaMiddleware from "redux-saga";
import { reduxBatch } from "@manaflair/redux-batch";

import accountIdFilter from "./accountIdFilter";
import accounts from "./accounts";
import application from "./application";
import amountFilter from "./amountFilter";
import bunqMeTab from "./bunqMeTab";
import bunqMeTabFilter from "./bunqMeTabFilter";
import bunqMeTabs from "./bunqMeTabs";
import cardCvc2 from "./cardCvc2";
import cardIdFilter from "./cardIdFilter";
import cards from "./cards";
import categories from "./categories";
import categoryFilter from "./categoryFilter";
import categoryRules from "./categoryRules";
import contacts from "./contacts";
import dateFilter from "./dateFilter";
import exportNew from "./exportNew";
import exports from "./exports";
import snackbar from "./snackbar";

import general_filter from "~reducers/general_filter";
import master_card_action_info from "~reducers/master_card_action_info";
import master_card_actions from "~reducers/master_card_actions";
import modal from "~reducers/modal";
import note_texts from "~reducers/note_texts";
import options from "~reducers/options";
import oauth from "~reducers/oauth";
import pagination from "~reducers/pagination";
import pay from "~reducers/pay";
import payment_filter from "~reducers/payment_filter";
import payment_info from "~reducers/payment_info";
import payments from "~reducers/payments";
import pending_payments from "~reducers/pending_payments";
import queue from "~reducers/queue";
import registration from "~reducers/registration";
import request_filter from "~reducers/request_filter";
import request_inquiries from "~reducers/request_inquiries";
import request_inquiry from "~reducers/request_inquiry";
import request_inquiry_batches from "~reducers/request_inquiry_batches";
import request_inquiry_info from "~reducers/request_inquiry_info";
import request_response from "~reducers/request_response";
import request_response_info from "~reducers/request_response_info";
import request_responses from "~reducers/request_responses";
import savings_goals from "~reducers/savings_goals";
import scheduled_payments from "~reducers/scheduled_payments";
import search_filter from "~reducers/search_filter";
import share_invite_monetary_account_inquiries from "~reducers/share_invite_monetary_account_inquiries";
import share_invite_monetary_account_inquiry from "~reducers/share_invite_monetary_account_inquiry";
import share_invite_monetary_account_responses from "~reducers/share_invite_monetary_account_responses";
import sidebar from "~reducers/sidebar";
import user from "~reducers/user";
import users from "~reducers/users";

const slices = {
    accountIdFilter,
    accounts,
    application,
    amountFilter,
    bunqMeTab,
    bunqMeTabFilter,
    bunqMeTabs,
    cardCvc2,
    cardIdFilter,
    cards,
    categories,
    categoryFilter,
    categoryRules,
    contacts,
    dateFilter,
    exportNew,
    exports,
    snackbar,
};

const reducer = {
    accountIdFilter: accountIdFilter.reducer,
    accounts: accounts.reducer,
    application: application.reducer,
    amountFilter: amountFilter.reducer,
    bunqMeTab: bunqMeTab.reducer,
    bunqMeTabFilter: bunqMeTabFilter.reducer,
    bunqMeTabs: bunqMeTabs.reducer,
    cardCvc2: cardCvc2.reducer,
    cardIdFilter: cardIdFilter.reducer,
    cards: cards.reducer,
    categories: categories.reducer,
    categoryFilter: categoryFilter.reducer,
    categoryRules: categoryRules.reducer,
    contacts: contacts.reducer,
    dateFilter: dateFilter.reducer,
    exportNew: exportNew.reducer,
    exports: exports.reducer,
    snackbar: snackbar.reducer,

    general_filter,
    master_card_action_info,
    master_card_actions,
    modal,
    note_texts,
    oauth,
    options,
    pagination,
    pay,
    payment_filter,
    payment_info,
    payments,
    pending_payments,
    queue,
    registration,
    request_filter,
    request_inquiries,
    request_inquiry,
    request_inquiry_batches,
    request_inquiry_info,
    request_response,
    request_response_info,
    request_responses,
    savings_goals,
    scheduled_payments,
    search_filter,
    share_invite_monetary_account_inquiries,
    share_invite_monetary_account_inquiry,
    share_invite_monetary_account_responses,
    sidebar,
    user,
    users,
};

const sagaMiddleware = createSagaMiddleware();

const middleware = [...getDefaultMiddleware(), sagaMiddleware];

const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: [reduxBatch as any],
});

for (const slice of Object.values<any>(slices)) {
    if (slice.saga) {
        sagaMiddleware.run(slice.saga);
    }
}

// Batched actions
export type BatchedActions = Array<GenericThunkAction | AnyAction>;
export type GenericThunkAction = ThunkAction<any, any, any, AnyAction>;
export type BatchDispatch = (actions: AnyAction[]) => AnyAction[];
export type ThunkDispatch = (actions: GenericThunkAction | GenericThunkAction[]) => Promise<any>;
export type MixedMultiDispatch = (actions: BatchedActions) => any;

export type AppDispatch = Dispatch<AnyAction> & BatchDispatch & ThunkDispatch & MixedMultiDispatch;

export type ReduxState = ReturnType<typeof store.getState>;

export default store;
