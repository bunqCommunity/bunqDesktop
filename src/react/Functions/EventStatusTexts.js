import { formatMoney } from "./Utils";

export const eventGenericPrimaryText = (event, t, accounts = false) => {
    const interestEventText = t("You have received interest");
    const invoiceText = t("Invoice ");
    switch (event.type) {
        case "InterestPayout":
            return interestEventText;
        case "Invoice":
            return `${invoiceText} ${event.object.invoice_number}`;
        case "SavingsAutoSaveResult":
            return savingsAutoSaveResultPrimaryText(event.object, t, accounts);
        case "BunqMeFundraiserResult":
            return bunqMeFundRaiserResultPrimaryText(event.object, t);
        case "IdealMerchantTransaction":
            return event.object.counterparty_alias.display_name;
        case "BunqMeTabResultResponse":
        default:
            return `Event ${event.type}`;
    }
};

export const eventGenericText = (event, t) => {
    const IdealMerchantTransaction = t("Received iDeal payment");
    const interestEventText = t("So far you've earned");
    const dailySaveTotalText = t("Daily Auto Save Total");

    switch (event.type) {
        case "BunqMeFundraiserResult":
            return bunqMeFundRaiserResultText(event.object, t);
        case "BunqMeTabResultResponse":
            return bunqMeTabResultResponseText(event.object, t);
        case "IdealMerchantTransaction":
            return IdealMerchantTransaction;
        case "SavingsAutoSaveResult":
            return dailySaveTotalText;
        case "InterestPayout":
            return `${interestEventText} ${formatMoney(event.getAmount())}`;
        case "Invoice":
            return invoiceText(event.object, t);
        default:
            return `Event ${event.type}`;
    }
};

export const savingsAutoSaveResultPrimaryText = (savingsAutoSaveResult, t, accounts = false) => {
    const firstEntry = savingsAutoSaveResult._savings_auto_save_entries[0];
    if (firstEntry && accounts) {
        const firstPayment = firstEntry.payment_savings;

        if (firstPayment.alias && firstPayment.alias.iban) {
            const matchedAccount = accounts.find(account => {
                return !!account.alias.find(alias => {
                    if (alias.type === "IBAN") {
                        if (alias.value === firstPayment.alias.iban) return true;
                    }
                    return false;
                });
            });

            if (matchedAccount) return matchedAccount.description;
        }
    }

    return "Daily savings summary";
};

export const bunqMeFundRaiserResultText = (bunqMeFundRaiserResult, t) => {
    const received = t("Received bunqme payments");

    return received;
};
export const bunqMeFundRaiserResultPrimaryText = (bunqMeFundRaiserResult, t) => {
    const andOthersText = t("and others");

    const firstPayment = bunqMeFundRaiserResult.payments[0];
    let resultText = firstPayment.counterparty_alias.display_name;
    if (bunqMeFundRaiserResult.payments.length > 1) {
        resultText = `${resultText} ${andOthersText}`;
    }

    return resultText;
};
const bunqMeTabResultResponseText = (bunqMeTabResultResponse, t) => {
    const received = t("Received bunqme payment");
    const fromText = t("from");

    return `${received} ${fromText} ${bunqMeTabResultResponse.payment.counterparty_alias.display_name}`;
};
export const invoiceText = (invoice, t) => {
    const paidText = t("Invoice paid");

    switch (invoice.status) {
        // TODO missing types
        case "CREDITED":
        default:
            return paidText;
    }
};

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
    }
    return paymentType;
};

export const masterCardActionText = (masterCardAction, t) => {
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
            return t("The payment was reversed");
        default:
            return `${t("The payment currently has the status ")}${masterCardAction.authorisation_status} - ${
                masterCardAction.authorisation_type
            }`;
    }
};

export const masterCardActionParser = (masterCardAction, t) => {
    const defaultMessage = t("Card payment");
    const paymentText = t("Payment");
    const refundText = t("Refund");
    const atmText = t("ATM Withdrawal");

    let secondaryText = paymentText;
    if (masterCardAction.authorisation_status === "CLEARING_REFUND") {
        secondaryText = refundText;
    }

    if (masterCardAction.pan_entry_mode_user === "ATM") {
        return atmText;
    }

    if (masterCardAction.label_card) {
        if (masterCardAction.wallet_provider_id === "103") {
            return "Apple Pay " + secondaryText;
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
