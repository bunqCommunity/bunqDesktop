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

export function setSearchFilter(searchTerm = "") {
    return {
        type: "SEARCH_SET_SEARCH_TERM",
        payload: {
            search_term: searchTerm
        }
    };
}
export function clearSearchFilter() {
    return {
        type: "CLEAR_SET_SEARCH_TERM"
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

export function setFromDateFilter(date = null) {
    return {
        type: "DATE_FILTER_FROM_SET",
        payload: {
            date: date
        }
    };
}

export function setToDateFilter(date = null) {
    return {
        type: "DATE_FILTER_TO_SET",
        payload: {
            date: date
        }
    };
}

export function addCategoryIdFilter(categoryId) {
    return {
        type: "CATEGORY_FILTER_ADD_CATEGORY_ID",
        payload: {
            category_id: categoryId
        }
    };
}

export function removeCategoryIdFilter(index) {
    return {
        type: "CATEGORY_FILTER_REMOVE_CATEGORY_ID",
        payload: {
            index: index
        }
    };
}

export function clearFromDateFilter() {
    return {
        type: "DATE_FILTER_FROM_CLEAR"
    };
}

export function clearToDateFilter() {
    return {
        type: "DATE_FILTER_TO_CLEAR"
    };
}
