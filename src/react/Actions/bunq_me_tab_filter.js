export function setBunqMeTabFilterType(type = false) {
    return {
        type: "BUNQ_ME_TAB_FILTER_SET_TYPE",
        payload: {
            type: type
        }
    };
}

export function toggleBunqMeTabFilterVisibility() {
    return {
        type: "BUNQ_ME_TAB_FILTER_TOGGLE_VISIBILITY"
    };
}

export function clearBunqMeTabFilterType() {
    return {
        type: "BUNQ_ME_TAB_FILTER_CLEAR"
    };
}
