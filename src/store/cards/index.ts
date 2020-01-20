import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CARD_ORDER_LOCATION } from "~misc/consts";
import Card from "~models/Card";

const store = require("store");

const cardOrderDefault: number[] = store.get(CARD_ORDER_LOCATION) !== undefined ? store.get(CARD_ORDER_LOCATION) : [];

export interface ISetInfoPayload {
    user_id: number;
    cards: Array<Card>;
}

const setInfoAction = createAction("setInfo");
const setOrderAction = createAction("setOrder");
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");
const clearAction = createAction("clear");


export interface ICardsState {
    cards: Array<Card>;
    card_order: Array<number>;
    loading: boolean;
}

const initialState: ICardsState = {
    cards: [],
    card_order: cardOrderDefault,
    loading: false
};

const slice = createSlice({
    name: "cards",
    initialState,
    reducers: {
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            const currentCardOrder = state.card_order ? state.card_order : [];
            const cardOrder = [...currentCardOrder];
            const cards = action.payload.cards;

            cards.forEach(card => {
                const cardId = card.id;
                if (!cardOrder.includes(cardId)) {
                    cardOrder.push(cardId);
                }
            });

            store.set(CARD_ORDER_LOCATION, cardOrder);
            state.cards = action.payload.cards;
            state.card_order = cardOrder;
        },
        [setOrderAction.type](state, action: PayloadAction<number[]>) {
            store.set(CARD_ORDER_LOCATION, action.payload);

            state.card_order = action.payload;
        },
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [clearAction.type]() {
            // TODO: turn into a saga subscribe
            store.remove(CARD_ORDER_LOCATION);
            return initialState;
        },
        ["REGISTRATION_CLEAR_PRIVATE_DATA"]() {
            // TODO: turn into a saga subscribe
            store.remove(CARD_ORDER_LOCATION);
            return initialState;
        },
        ["REGISTRATION_LOG_OUT"]() {
            // TODO: turn into a saga subscribe
            store.remove(CARD_ORDER_LOCATION);
            return initialState;
        },
        ["REGISTRATION_CLEAR_USER_INFO"]() {
            // TODO: turn into a saga subscribe
            store.remove(CARD_ORDER_LOCATION);
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
