export const requestResponseText = (requestResponse, t) => {
    const ACCEPTED = t("You paid the request");
    const PENDING = t("Received a request");
    const REJECTED = t("You denied the request");
    const REVOKED = t("Request was cancelled");
    const EXPIRED = t("Request has expired");
    switch (requestResponse.status) {
        case "ACCEPTED":
            return ACCEPTED;
        case "PENDING":
            return PENDING;
        case "REJECTED":
            return REJECTED;
        case "REVOKED":
            return REVOKED;
        case "EXPIRED":
            return EXPIRED;
        default:
            return requestResponse.status;
    }
};

export const requestInquiryText = (requestInquiry, t) => {
    const ACCEPTED = t("Your request was accepted");
    const PENDING = t("Request sent and pending");
    const REJECTED = t("Your request was denied");
    const REVOKED = t("You cancelled the request");
    const EXPIRED = t("Request has expired");
    switch (requestInquiry.status) {
        case "ACCEPTED":
            return ACCEPTED;
        case "PENDING":
            return PENDING;
        case "REJECTED":
            return REJECTED;
        case "REVOKED":
            return REVOKED;
        case "EXPIRED":
            return EXPIRED;
        default:
            return requestInquiry.status;
    }
};

export const paymentText = (payment, t) => {
    const sentPaymentLabel = t("Sent payment with ");
    const receivedPaymentLabel = t("Received payment with ");
    const label =
        payment.amount.value < 0 ? sentPaymentLabel : receivedPaymentLabel;

    return `${label}${paymentTypeParser(payment.type, t)}`;
};

export const paymentTypeParser = (paymentType, t) => {
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

export const masterCardActionText = (masterCardAction, t) => {
    switch (masterCardAction.authorisation_status) {
        case "AUTHORISED":
            return `${t("Sent payment with ")}${masterCardActionParser(
                masterCardAction,
                t
            )}`;
        case "BLOCKED":
            return `${t(
                "The payment was blocked due to "
            )}${masterCardAction.decision_description}`;
        default:
            return `${t(
                "The payment currently has the status "
            )}${masterCardAction.authorisation_status} - ${masterCardAction.authorisation_type}`;
    }
};

export const masterCardActionParser = (masterCardAction, t) => {
    const paymentText = t("Payment");

    if (masterCardAction.label_card) {
        if(masterCardAction.wallet_provider_id === "103"){
            return "Apple Pay " + paymentText;
        }

        switch (masterCardAction.label_card.type) {
            case "MAESTRO_MOBILE_NFC":
                return "Tap & Pay " + paymentText;
            case "MASTERCARD":
                return "Mastercard " + paymentText;
            case "MAESTRO":
                return "Maestro " + paymentText;
        }
    }
    return "Card payment";
};
