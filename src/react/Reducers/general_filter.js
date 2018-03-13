export const defaultState = {
    date: new Date()
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "GENERAL_FILTER_RESET":

        case "DATE_FILTER_FROM_SET":
        case "DATE_FILTER_TO_SET":
        case "DATE_FILTER_FROM_CLEAR":
        case "DATE_FILTER_TO_CLEAR":

        case "BUNQ_ME_TAB_FILTER_SET_TYPE":
        case "BUNQ_ME_TAB_FILTER_TOGGLE_VISIBILITY":
        case "BUNQ_ME_TAB_FILTER_CLEAR":

        case "REQUEST_FILTER_SET_TYPE":
        case "REQUEST_FILTER_TOGGLE_VISIBILITY":
        case "REQUEST_FILTER_CLEAR":

        case "PAYMENT_FILTER_SET_TYPE":
        case "PAYMENT_FILTER_TOGGLE_VISIBILITY":
        case "PAYMENT_FILTER_CLEAR":
            // any filter change updates the filter timestamp
            // for easier comparisons in shouldComponentUpdate handlers
            return {
                date: new Date()
            };
            break;
    }
    return state;
}
