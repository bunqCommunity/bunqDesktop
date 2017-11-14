export function setBunqMeTabFilterType(type = false) {
    return {
        type: "BUNQ_ME_TAB_FILTER_SET_TYPE",
        payload: {
            type: type
        }
    };
}

export function clearBunqMeTabFilterType() {
    return {
        type: "BUNQ_ME_TAB_FILTER_CLEAR"
    };
}
