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
    if (!dateCheck) {
        return false;
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

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        masterCardAction.MasterCardAction.updated
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

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        requestInquiry.RequestInquiry.updated
    );
};
