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
