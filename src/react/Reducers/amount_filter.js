export const defaultState = {
    amount: "",
    type: "EQUALS"
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "AMOUNT_FILTER_SET_AMOUNT":
            const newAmount = action.payload.amount === "" ? "" : parseFloat(action.payload.amount);

            return {
                ...state,
                amount: newAmount
            };

        case "AMOUNT_FILTER_SET_TYPE":
            return {
                ...state,
                type: action.payload.type
            };

        case "AMOUNT_FILTER_CLEAR":
        case "GENERAL_FILTER_RESET":
            return {
                ...defaultState
            };
    }
    return state;
}
