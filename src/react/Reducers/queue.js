export const defaultState = {
    loading: false,
    request_counter: 0
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "QUEUE_INCREASE_REQUEST_COUNTER":
            const increasedCounter = state.request_counter + 1;
            const increasedLoading = increasedCounter > 0;

            return {
                ...state,
                request_counter: increasedCounter,
                loading: increasedLoading
            };

        case "QUEUE_DECREASE_REQUEST_COUNTER":
            const decreasedCounter = state.request_counter - 1;
            const decreasedLoading = decreasedCounter > 0;

            return {
                ...state,
                request_counter: decreasedCounter,
                loading: decreasedLoading
            };
    }
    return state;
}
