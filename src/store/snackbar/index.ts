import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISnackbarOpenPayload {
    message: string;
    duration?: number;
}

const openAction = createAction("open");
const closeAction = createAction("close");

export interface ISnackbarState {
    message: string;
    duration: number;
    snackbarOpen: boolean;
}

const initialState: ISnackbarState = {
    message: "",
    duration: 4000,
    snackbarOpen: false
};

const slice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        [openAction.type](state, action: PayloadAction<ISnackbarOpenPayload>) {
            state.snackbarOpen = true;
            state.message = action.payload.message;
            state.duration = action.payload.duration || initialState.duration;
        },
        [closeAction.type]() {
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
