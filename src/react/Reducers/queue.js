export const defaultState = {
    loading: false,
    request_counter: 0,
    max_request_counter: 0,
    trigger_sync: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "QUEUE_INCREASE_REQUEST_COUNTER":
            const increasedCounter = state.request_counter + 1;
            const increasedLoading = increasedCounter > 0;

            return {
                ...state,
                request_counter: increasedCounter,
                max_request_counter:
                    state.max_request_counter > increasedCounter
                        ? state.max_request_counter
                        : increasedCounter,
                loading: increasedLoading
            };

        case "QUEUE_DECREASE_REQUEST_COUNTER":
            const decreasedCounter = state.request_counter - 1;
            const decreasedLoading = decreasedCounter > 0;

            // reset to 0 if no longer loading
            const maxRequestCounter = decreasedLoading
                ? state.max_request_counter
                : 0;

            return {
                ...state,
                request_counter: decreasedCounter,
                max_request_counter: maxRequestCounter,

                loading: decreasedLoading
            };

        case "QUEUE_START_SYNC":
            return {
                ...state,
                trigger_sync: true
            };
        case "QUEUE_RESET_SYNC_STATE":
            return {
                ...state,
                trigger_sync: false
            };
    }
    return state;
}
