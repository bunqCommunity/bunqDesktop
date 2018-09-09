export const defaultState = {
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {

        case "QUEUE_ADD":
            return {
                ...state
            };

    }
    return state;
}
