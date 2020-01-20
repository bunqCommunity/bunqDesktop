import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const addAction = createAction("add");
const removeAction = createAction("remove");
const toggleAction = createAction("toggle");
const clearAction = createAction("clear");

export interface IAccountIdFilterState {
    selectedAccountIds: Array<number>;
    toggle: boolean;
}

const initialState: IAccountIdFilterState = {
    selectedAccountIds: [],
    toggle: false,
};

const slice = createSlice({
    name: "accountIdFilter",
    initialState,
    reducers: {
        [addAction.type](state, action: PayloadAction<number>) {
            // prevent duplicates
            if (!state.selectedAccountIds.includes(action.payload)) {
                state.selectedAccountIds.push(action.payload);
            }
        },
        [removeAction.type](state, action: PayloadAction<number>) {
            const removeIndex = state.selectedAccountIds.findIndex(accountId => accountId === action.payload);
            if (removeIndex === -1) {
                return;
            }

            state.selectedAccountIds.splice(removeIndex, 1);
        },
        [toggleAction.type](state) {
            state.toggle = !state.toggle;
        },
        [clearAction.type]() {
            return initialState;
        },
        ["GENERAL_FILTER_RESET"]() {
            // TODO: turn into a saga subscriber
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
