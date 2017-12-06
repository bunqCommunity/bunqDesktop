export const requestResponseText = requestResponse => {
    switch (requestResponse.status) {
        case "ACCEPTED":
            return "You paid the request";
        case "PENDING":
            return "Received a request";
        case "REJECTED":
            return "You denied the request";
        case "REVOKED":
            return "Request was cancelled";
    }
};

export const requestInquiryText = requestInquiry => {
    switch (requestInquiry.status) {
        case "ACCEPTED":
            return "Your request was accepted";
        case "PENDING":
            return "Request sent and pending";
        case "REJECTED":
            return "Your request was denied";
        case "REVOKED":
            return "You cancelled the request";
        case "EXPIRED":
            return "Request is expired";
    }
};

export const paymentText = payment => {
    const label =
        payment.amount.value < 0
            ? "Sent payment with "
            : "Received payment with ";

    return `${label}${paymentTypeParser(payment.type)}`;
};

export const paymentTypeParser = paymentType => {
    switch (paymentType) {
        case "BUNQ":
            return "bunq";
        case "IDEAL":
            return "iDEAL";
        case "EBA_SCT":
            return "SEPA credit transfer";
        case "EBA_SDD":
            return "SEPA direct debit";
    }
    return paymentType;
};

export const masterCardActionText = masterCardAction => {
    switch (masterCardAction.authorisation_status) {
        case "AUTHORISED":
            return `Sent payment with ${masterCardActionParser(
                masterCardAction.pan_entry_mode_user
            )}`;
        case "BLOCKED":
            return `The payment was blocked due to: ${masterCardAction.decision_description}`;
        default:
            return `The payment (${masterCardAction.authorisation_type}) currently has the status: ${masterCardAction.authorisation_status}`;
    }
};

export const masterCardActionParser = masterCardActionType => {
    switch (masterCardActionType) {
        case "ATM":
            return "ATM";
        case "ICC":
            return "Tap & Pay";
        case "MAGNETIC_STRIPE":
            return "MAGNETIC_STRIPE";
        case "E_COMMERCE":
            return "E_COMMERCE";
    }
    return masterCardActionType;
};
