import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const addCategoryIdAction = createAction("addCategoryId");
const removeCategoryIdAction = createAction("removeCategoryId");
const toggleAction = createAction("toggle");
const clearAction = createAction("clear");
const resetAction = createAction("reset");

export interface ICategoryFilterState {
    selected_categories: Array<number>;
    toggle: boolean;
}

const initialState: ICategoryFilterState = {
    selected_categories: [],
    toggle: false
};

const slice = createSlice({
    name: "categoryFilter",
    initialState,
    reducers: {
        [addCategoryIdAction.type](state, action: PayloadAction<number>) {
            // prevent duplicates
            if (!state.selected_categories.includes(action.payload)) {
                state.selected_categories.push(action.payload);
            }
        },
        [removeCategoryIdAction.type](state, action: PayloadAction<number>) {
            state.selected_categories.splice(action.payload, 1);
        },
        [toggleAction.type](state) {
            state.toggle = !state.toggle;
        },
        [clearAction.type]() {
            return initialState;
        },
        [resetAction.type]() {
            return initialState;
        },
    },
});

export const { name, reducer, actions, caseReducers } = slice;
export default { name, reducer, actions, caseReducers };
