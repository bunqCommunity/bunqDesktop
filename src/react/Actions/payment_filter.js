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
