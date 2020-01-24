import { createAction, createSlice } from "@reduxjs/toolkit";

const isLoading = createAction("isLoading");
const isNotLoading = createAction("isNotLoading");

const initialState = {
    loading: false,
};

const slice = createSlice({
    name: "bunqMeTab",
    initialState,
    reducers: {
        [isLoading.type](state) {
            state.loading = true;
        },
        [isNotLoading.type](state) {
            state.loading = false;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
