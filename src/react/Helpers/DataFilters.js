import CategoryHelper from "./CategoryHelper";

const checkDateRange = (fromDate, toDate, date) => {
    // nothing to check so always valid
    if (fromDate === null && toDate === null) return true;

    // turn date into object
    const dateObject = new Date(date);
    const time = dateObject.getTime();

    if (fromDate !== null) {
        if (time < fromDate.getTime()) {
            // outside from range
            return false;
        }
    }
    if (toDate !== null) {
        if (time > toDate.getTime()) {
            // outside to range
            return false;
        }
    }

    return true;
};

export const paymentFilter = options => payment => {
    if (options.paymentVisibility === false) {
        return false;
    }
    const paymentInfo = payment.Payment;

    // hide mastercard payments
    if (paymentInfo.type === "MASTERCARD") {
        return false;
    }

    if (options.paymentType) {
        if (options.paymentType === "received") {
            if (paymentInfo.amount.value <= 0) {
                return false;
            }
        } else if (options.paymentType === "sent") {
            if (paymentInfo.amount.value >= 0) {
                return false;
            }
        }
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            payment.description.toLowerCase(),
            payment.alias.iban.toLowerCase(),
            payment.alias.display_name.toLowerCase(),
            payment.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections
    ) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "Payment",
                payment.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return false;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });
            if (!categoryMatches) return false;
        }
    }

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        paymentInfo.created
    );
};

export const bunqMeTabsFilter = options => bunqMeTab => {
    if (options.bunqMeTabVisibility === false) {
        return false;
    }

    const dateCheck = checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        bunqMeTab.BunqMeTab.created
    );
    if (!dateCheck) return false;

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            bunqMeTab.bunqme_tab_entry.description.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections
    ) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "BunqMeTab",
                bunqMeTab.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return false;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });
            if (!categoryMatches) return false;
        }
    }

    switch (options.bunqMeTabType) {
        case "active":
            return bunqMeTab.BunqMeTab.status === "WAITING_FOR_PAYMENT";
        case "cancelled":
            return bunqMeTab.BunqMeTab.status === "CANCELLED";
        case "expired":
            return bunqMeTab.BunqMeTab.status === "EXPIRED";
    }

    return true;
};

export const masterCardActionFilter = options => masterCardAction => {
    if (options.paymentVisibility === false) {
        return false;
    }

    if (options.paymentType === "received") {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            masterCardAction.description.toLowerCase(),
            masterCardAction.alias.display_name.toLowerCase(),
            masterCardAction.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections
    ) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "MasterCardAction",
                masterCardAction.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return false;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });
            if (!categoryMatches) return false;
        }
    }

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        masterCardAction.MasterCardAction.created
    );
};

export const requestResponseFilter = options => requestResponse => {
    if (options.requestVisibility === false) {
        return false;
    }

    // hide accepted payments
    if (requestResponse.RequestResponse.status === "ACCEPTED") {
        return false;
    }

    if (options.requestType !== "sent" && options.requestType !== "default") {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            requestResponse.description.toLowerCase(),
            requestResponse.alias.display_name.toLowerCase(),
            requestResponse.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections
    ) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "RequestResponse",
                requestResponse.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return false;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });
            if (!categoryMatches) return false;
        }
    }

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        requestResponse.RequestResponse.updated
    );
};

export const requestInquiryFilter = options => requestInquiry => {
    if (options.requestVisibility === false) {
        return false;
    }

    if (requestInquiry.RequestInquiry.status === "ACCEPTED") {
        return false;
    }

    if (
        options.requestType !== "received" &&
        options.requestType !== "default"
    ) {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            requestInquiry.description.toLowerCase(),
            requestInquiry.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections
    ) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "RequestInquiry",
                requestInquiry.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return false;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });
            if (!categoryMatches) return false;
        }
    }

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        requestInquiry.RequestInquiry.updated
    );
};
