export const defaultState = {
    message: "",
    title: "",
    modalOpen: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "MODAL_OPEN":
            return {
                ...state,
                modalOpen: true,
                message: action.payload.message,
                title: action.payload.title
            };

        case "MODAL_CLOSE":
            return {
                ...state,
                ...defaultState
            };
    }
    return state;
}
