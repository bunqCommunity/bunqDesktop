export function resetFilters() {
    return {
        type: "GENERAL_FILTER_RESET"
    };
}

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

export function setPaymentFilterType(type = false) {
    return {
        type: "PAYMENT_FILTER_SET_TYPE",
        payload: {
            type: type
        }
    };
}

export function togglePaymentFilterVisibility() {
    return {
        type: "PAYMENT_FILTER_TOGGLE_VISIBILITY"
    };
}

export function clearPaymentFilterType() {
    return {
        type: "PAYMENT_FILTER_CLEAR"
    };
}

export function setRequestFilterType(type = false) {
    return {
        type: "REQUEST_FILTER_SET_TYPE",
        payload: {
            type: type
        }
    };
}

export function toggleRequestFilterVisibility() {
    return {
        type: "REQUEST_FILTER_TOGGLE_VISIBILITY"
    };
}

export function clearRequestFilterType() {
    return {
        type: "REQUEST_FILTER_CLEAR"
    };
}
