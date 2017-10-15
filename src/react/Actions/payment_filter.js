export function setPaymentFilterType(type = false) {
    return {
        type: "PAYMENT_FILTER_SET_TYPE",
        payload: {
            type: type,
        }
    };
}
export function rotatePaymentFilterType() {
    return {
        type: "PAYMENT_FILTER_ROTATE_TYPE"
    };
}

export function clearPaymentFilterType() {
    return {
        type: "PAYMENT_FILTER_CLEAR"
    };
}
