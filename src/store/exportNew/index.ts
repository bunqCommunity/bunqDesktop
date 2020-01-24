import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const isLoadingAction = createAction("isLoading");
const isNotLoadingAction = createAction("isNotLoading");

export interface IExportNewState {
    loading: boolean;
}

const initialState: IExportNewState = {
    loading: false,
};

const slice = createSlice({
    name: "exportNew",
    initialState,
    reducers: {
        [isLoadingAction.type](state) {
            state.loading = true;
        },
        [isNotLoadingAction.type](state) {
            state.loading = false;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
