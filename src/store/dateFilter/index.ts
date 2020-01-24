import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const fromSetAction = createAction("fromSet");
const toSetAction = createAction("toSet");
const fromClearAction = createAction("fromClear");
const toClearAction = createAction("toClear");
const resetAction = createAction("reset");

export interface ICategoryFilterState {
    from_date: null | number;
    to_date: null | number;
}

const initialState: ICategoryFilterState = {
    from_date: null,
    to_date: null,
};

const slice = createSlice({
    name: "dateFilter",
    initialState,
    reducers: {
        [fromSetAction.type](state, action: PayloadAction<number>) {
            state.from_date = action.payload;
        },
        [toSetAction.type](state, action: PayloadAction<number>) {
            state.to_date = action.payload;
        },
        [fromClearAction.type](state) {
            state.from_date = null;
        },
        [toClearAction.type](state) {
            state.to_date = null;
        },
        [resetAction.type]() {
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
