// type	= DIRECT_DEBIT, DIRECT_DEBIT_B2B, IDEAL, SOFORT or INTERNAL.
// sub_type	= ONCE or RECURRING for DIRECT_DEBIT RequestInquiries and NONE

export const requestResponseText = (requestResponse, t) => {
    let requestType = requestResponseTypeParser(requestResponse, t);

    const ACCEPTED = `${requestType} ${t(`payment accepted`)}`;
    const PENDING = `${requestType} ${t(`is pending`)} `;
    const REJECTED = `${t(`You denied the`)} ${requestType} ${t(`payment`)}`;
    const REVOKED = `${t(`The`)} ${requestType} ${t(`payment was cancelled`)}`;
    const EXPIRED = `${t(`The`)} ${requestType} ${t(`payment has expired`)}`;
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

export const requestResponseTypeParser = (requestResponse, t) => {
    const directDebit = t("direct debit");
    const request = t("Request");

    switch (requestResponse.type) {
        case "DIRECT_DEBIT":
        case "DIRECT_DEBIT_B2B":
            return directDebit;
        case "SOFORT":
            return "SOFORT";
        case "IDEAL":
            return "iDEAL";
        case "INTERNAL":
        default:
            return request;
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
    const label = payment.amount.value < 0 ? sentPaymentLabel : receivedPaymentLabel;

    return `${label}${paymentTypeParser(payment.type, t)}`;
};

export const paymentTypeParser = (paymentType, t) => {
    switch (paymentType) {
        case "BUNQ":
            return "bunq";
        case "BUNQME":
            return "bunq.me";
        case "IDEAL":
            return "iDEAL";
        case "SAVINGS":
            return "savings";
        case "EBA_SCT":
            return "SEPA credit transfer";
        case "EBA_SDD":
            return "SEPA direct debit";
        case "CHECKOUT_MERCHANT":
            return "top up";
    }
    return paymentType;
};

export const masterCardActionText = (masterCardAction, t) => {
    const reversedText = t("The payment was reversed");

    switch (masterCardAction.authorisation_status) {
        case "AUTHORISED":
            return `${t("Sent payment with ")}${masterCardActionParser(masterCardAction, t)}`;
        case "BLOCKED":
            return `${t("The payment was blocked due to ")}${masterCardAction.decision_description}`;
        case "CLEARING_REFUND":
            if (masterCardAction.decision_description) {
                return `${t("Payment was refunded due to ")}${masterCardAction.decision_description}`;
            }
            return t("Payment was refunded");
        case "REVERSED":
            const authorisationTypeText = masterCardActionAuthorisationType(masterCardAction.authorisation_type, t);
            if (authorisationTypeText) {
                return `${reversedText}: ${authorisationTypeText}`;
            }
            return reversedText;
        default:
            return `${t("The payment currently has the status ")}${masterCardAction.authorisation_status} - ${
                masterCardAction.authorisation_type
            }`;
    }
};

export const masterCardActionAuthorisationType = (authorisationType, t) => {
    const authorisationPayment = t("Authorisation payment");

    switch (authorisationType) {
        case "ACCOUNT_STATUS":
        case "NORMAL_AUTHORISATION":
            return authorisationPayment;
        default:
            return "";
    }
};

export const masterCardActionParser = (masterCardAction, t) => {
    const defaultMessage = t("Card payment");
    const paymentText = t("Payment");
    const refundText = t("Refund");
    const reversedText = t("Reversed");
    const authorisationPayment = t("Authorisation");
    const atmText = t("ATM Withdrawal");

    let secondaryText = paymentText;
    if (masterCardAction.authorisation_status === "CLEARING_REFUND") {
        secondaryText = refundText;
    } else if (masterCardAction.authorisation_status === "REVERSED") {
        if (
            masterCardAction.authorisation_type === "NORMAL_AUTHORISATION" ||
            masterCardAction.authorisation_type === "ACCOUNT_STATUS"
        ) {
            secondaryText = authorisationPayment;
        } else {
            secondaryText = reversedText;
        }
    }

    if (masterCardAction.pan_entry_mode_user === "ATM") {
        return atmText;
    }

    if (masterCardAction.label_card) {
        switch (masterCardAction.wallet_provider_id) {
            case "103":
                return "Apple Pay " + secondaryText;
            case "216":
                return "Google Pay " + secondaryText;
        }

        switch (masterCardAction.label_card.type) {
            case "MAESTRO_MOBILE_NFC":
                if (masterCardAction.wallet_provider_id === null) {
                    return defaultMessage;
                }
                return "Tap & Pay " + secondaryText;
            case "MASTERCARD":
                return "Mastercard " + secondaryText;
            case "MAESTRO":
                return "Maestro " + secondaryText;
        }
    }
    return defaultMessage;
};

export const cardStatus = (cardInfo, t) => {
    const ACTIVE = t("Active");
    const DEACTIVATED = t("Deactivated");
    const LOST = t("Lost");
    const STOLEN = t("Stolen");
    const CANCELLED = t("Cancelled");

    switch (cardInfo.status) {
        case "ACTIVE":
            return ACTIVE;
        case "DEACTIVATED":
            return DEACTIVATED;
        case "LOST":
            return LOST;
        case "STOLEN":
            return STOLEN;
        case "CANCELLED":
            return CANCELLED;
    }

    return cardInfo.status;
};

export const cardOrderStatus = (cardInfo, t) => {
    const VIRTUAL_DELIVERY = t("Delivered virtually");
    const SENT_FOR_PRODUCTION = t("Sent for production");
    const NEW_CARD_REQUEST_RECEIVED = t("New card request received");
    const ACCEPTED_FOR_PRODUCTION = t("Accepted for production");
    const DELIVERED_TO_CUSTOMER = t("Delivered to customer");
    const CARD_UPDATE_REQUESTED = t("Cards update requested");
    const CARD_UPDATE_SENT = t("Cards update sent");
    const CARD_UPDATE_ACCEPTED = t("Cards update accepted");

    switch (cardInfo.order_status) {
        case "VIRTUAL_DELIVERY":
            return `${VIRTUAL_DELIVERY}`;
        case "SENT_FOR_PRODUCTION":
            return `${SENT_FOR_PRODUCTION}`;
        case "ACCEPTED_FOR_PRODUCTION":
            return `${ACCEPTED_FOR_PRODUCTION}`;
        case "NEW_CARD_REQUEST_RECEIVED":
            return `${NEW_CARD_REQUEST_RECEIVED}`;
        case "DELIVERED_TO_CUSTOMER":
            return `${DELIVERED_TO_CUSTOMER}`;
        case "CARD_UPDATE_REQUESTED":
            return `${CARD_UPDATE_REQUESTED}`;
        case "CARD_UPDATE_SENT":
            return `${CARD_UPDATE_SENT}`;
        case "CARD_UPDATE_ACCEPTED":
            return `${CARD_UPDATE_ACCEPTED}`;
    }

    return cardInfo.order_status;
};
