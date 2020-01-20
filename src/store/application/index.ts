import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const setStatusMessageAction = createAction("setStatusMessage");
const setOnline = createAction("setOnline");
const setOffline = createAction("setOffline");
const setLastAutoUpdate = createAction("setLastAutoUpdate");
const setForceUpdate = createAction("setForceUpdate");
const setPdfMode = createAction("setPdfMode");

export interface IApplicationState {
    status_message: string;
    online: boolean;
    force_update: number;
    last_auto_update: number;
    pdf_save_mode_enabled: boolean;
}

const initialState: IApplicationState = {
    status_message: "",
    online: true,
    force_update: Date.parse('01 Jan 1970 00:00:00 GMT'),
    last_auto_update: Date.parse('01 Jan 1970 00:00:00 GMT'),
    pdf_save_mode_enabled: false,
};

const slice = createSlice({
    name: "application",
    initialState,
    reducers: {
        [setStatusMessageAction.type](state, action: PayloadAction<string>) {
            state.status_message = action.payload;
        },
        [setOnline.type](state) {
            state.online = true;
        },
        [setOffline.type](state) {
            state.online = false;
        },
        [setLastAutoUpdate.type](state) {
            state.last_auto_update = +new Date();
        },
        [setForceUpdate.type](state) {
            state.force_update = +new Date();
        },
        [setPdfMode.type](state, action: PayloadAction<boolean>) {
            state.pdf_save_mode_enabled = action.payload;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
