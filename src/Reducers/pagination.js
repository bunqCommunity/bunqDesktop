import store from "store";

export const PAGINATION_PAGE_SIZE = "BUNQDESKTOP_PAGINATION_PAGE_SIZE";

const paginationSizeStored = store.get(PAGINATION_PAGE_SIZE);

export const defaultState = {
    page_size: paginationSizeStored !== undefined ? paginationSizeStored : 10,
    page: 0
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "PAGINATION_PREVIOUS_PAGE":
            return {
                ...state,
                page: state.page - 1
            };

        case "PAGINATION_NEXT_PAGE":
            return {
                ...state,
                page: state.page + 1
            };

        case "PAGINATION_SET_PAGE":
            return {
                ...state,
                page: action.payload.page
            };

        case "PAGINATION_FIRST_PAGE":
            return {
                ...state,
                page: 0
            };

        case "PAGINATION_SET_PAGE_SIZE":
            store.set(PAGINATION_PAGE_SIZE, action.payload.page_size);
            return {
                ...state,
                page_size: action.payload.page_size
            };
    }
    return state;
}
