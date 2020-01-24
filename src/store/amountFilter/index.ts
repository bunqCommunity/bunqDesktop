import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const setAmountAction = createAction("setAmount", (payload: string) => ({ payload }));
const setTypeAction = createAction("setType", (payload: string) => ({ payload }));
const clearAction = createAction("clear", (payload: string) => ({ payload }));

export interface IAmountFilterState {
    amount: string;
    type: string;
}

const initialState: IAmountFilterState = {
    amount: "",
    type: "EQUALS"
};

const slice = createSlice({
    name: "amountFilter",
    initialState,
    reducers: {
        [setAmountAction.type](state, action: PayloadAction<string>) {
            state.amount = action.payload;
        },
        [setTypeAction.type](state, action: PayloadAction<string>) {
            state.type = action.payload;
        },
        [clearAction.type]() {
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
