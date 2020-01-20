import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const setType = createAction("setType", (payload: string) => ({ payload }));
const toggleVisibility = createAction("toggleVisibility");
const clear = createAction("clear");

export interface IBunqMeTabFilterState {
    type: string;
    visible: boolean;
}

const initialState: IBunqMeTabFilterState = {
    type: "default",
    visible: true,
};

const slice = createSlice({
    name: "bunqMeTabFilter",
    initialState,
    reducers: {
        [setType.type](state, action: PayloadAction<string>) {
            state.type = action.payload;
        },
        [toggleVisibility.type](state) {
            state.visible = !state.visible;
        },
        [clear.type]() {
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
