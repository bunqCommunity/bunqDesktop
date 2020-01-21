import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISetInfoPayload {
    exports: any;
    user_id: number;
    account_id: number;
}

const setInfoAction = createAction("setInfo");
const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");
const clearAction = createAction("clear");

export interface IExportsState {
    exports: Array<any>;
    user_id: boolean | number;
    account_id: boolean | number;
    loading: boolean;
}

const initialState: IExportsState = {
    exports: [],
    user_id: false,
    account_id: false,
    loading: false,
};

const slice = createSlice({
    name: "exports",
    initialState,
    reducers: {
        [setInfoAction.type](state, action: PayloadAction<ISetInfoPayload>) {
            state.exports = action.payload.exports;
            state.user_id = action.payload.user_id;
            state.account_id = action.payload.account_id;
        },
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
        [clearAction.type]() {
            return initialState;
        },
        ["REGISTRATION_CLEAR_PRIVATE_DATA"]() {
            return initialState;
        },
        ["REGISTRATION_LOG_OUT"]() {
            return initialState;
        },
        ["REGISTRATION_CLEAR_USER_INFO"]() {
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
