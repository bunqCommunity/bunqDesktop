import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISetInfoPayload {
    cvc2_codes: number[];
    user_id: number;
    card_id: number;
}

const setInfoAction = createAction("setInfo");
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");
const clearAction = createAction("clear");

export interface ICardCvc2State {
    loading: boolean;
    cvc2_codes: number[];
    user_id: number | boolean;
    card_id: number | boolean;
}

const initialState: ICardCvc2State = {
    loading: false,
    cvc2_codes: [],
    user_id: false,
    card_id: false
};

const slice = createSlice({
    name: "cardCvc2",
    initialState,
    reducers: {
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            state.card_id = action.payload.card_id;
            state.user_id = action.payload.user_id;
            state.cvc2_codes = action.payload.cvc2_codes;
        },
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [clearAction.type]() {
            // TODO: turn into saga subscriber
            return initialState;
        },
        ["REGISTRATION_LOG_OUT"]() {
            // TODO: turn into saga subscriber
            return initialState;
        },
        ["REGISTRATION_CLEAR_PRIVATE_DATA"]() {
            // TODO: turn into saga subscriber
            return initialState;
        },
        ["REGISTRATION_CLEAR_USER_INFO"]() {
            // TODO: turn into saga subscriber
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
