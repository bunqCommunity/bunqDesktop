export function nextPage() {
    return {
        type: "PAGINATION_NEXT_PAGE"
    };
}

export function previousPage() {
    return {
        type: "PAGINATION_PREVIOUS_PAGE"
    };
}

export function firstPage() {
    return {
        type: "PAGINATION_FIRST_PAGE"
    };
}

export function setPage(page) {
    return {
        type: "PAGINATION_SET_PAGE",
        payload: {
            page: page
        }
    };
}

export function setPageSize(pageSize) {
    return {
        type: "PAGINATION_SET_PAGE_SIZE",
        payload: {
            page_size: pageSize
        }
    };
}
