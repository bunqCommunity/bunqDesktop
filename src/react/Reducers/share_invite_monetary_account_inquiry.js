export const defaultState = {
    loading: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_LOADING":
            return {
                ...state,
                loading: true
            };

        case "SHARE_INVITE_MONETARY_ACCOUNT_INQUIRY_IS_NOT_LOADING":
            return {
                ...state,
                loading: false
            };
    }
    return state;
}
