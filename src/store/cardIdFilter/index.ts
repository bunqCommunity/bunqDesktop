import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

const addAction = createAction("add");
const removeAction = createAction("remove");
const toggleAction = createAction("toggle");
const clearAction = createAction("clear");

export interface IAccountIdFilterState {
    selected_card_ids: number[];
    toggle: boolean;
}

const initialState: IAccountIdFilterState = {
    selected_card_ids: [],
    toggle: false
};

const slice = createSlice({
    name: "cardIdFilter",
    initialState,
    reducers: {
        [addAction.type](state, action: PayloadAction<number>) {
            const currentCardIds = [...state.selected_card_ids];

            // prevent duplicates
            if (!currentCardIds.includes(action.payload)) {
                currentCardIds.push(action.payload);
            }

            state.selected_card_ids = currentCardIds;
        },
        [removeAction.type](state, action: PayloadAction<number>) {
            const currentCardIds2 = [...state.selected_card_ids];

            const removeIndex = currentCardIds2.findIndex(cardId => cardId === action.payload);
            if (removeIndex === -1) return state;

            currentCardIds2.splice(removeIndex, 1);

            state.selected_card_ids = currentCardIds2;
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
