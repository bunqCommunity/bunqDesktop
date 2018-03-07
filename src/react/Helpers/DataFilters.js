export const paymentFilter = options => payment => {
    if (options.paymentVisibility === false) {
        return false;
    }
    const paymentInfo = payment.Payment;

    // hide mastercard payments
    if (paymentInfo.type === "MASTERCARD") {
        return false;
    }

    if(options.paymentType){
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
    return true;
};

export const bunqMeTabsFilter = options => bunqMeTab => {
    if (options.bunqMeTabVisibility === false) {
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

    return options.paymentType !== "received";
};

export const requestResponseFilter = options => requestResponse => {
    if (options.requestVisibility === false) {
        return false;
    }

    // hide accepted payments
    if (requestResponse.RequestResponse.status === "ACCEPTED") return false;

    return !(
        options.requestType !== "sent" &&
        options.requestType !== "default"
    );
};

export const requestInquiryFilter = options => requestInquiry => {
    if (options.requestVisibility === false) {
        return false;
    }

    if (requestInquiry.RequestInquiry.status === "ACCEPTED") return false;

    return !(
        options.requestType !== "received" &&
        options.requestType !== "default"
    );
};
