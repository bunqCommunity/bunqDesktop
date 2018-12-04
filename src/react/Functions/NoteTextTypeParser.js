export default event => {
    const eventType = event.eventType;

    if (eventType === "MasterCardAction") {
        return false;
        // return "mastercard-action";
    } else if (eventType === "Payment") {
        return false;

        switch (event.type) {
            case "BUNQME":
                return "bunqme-fundraiser-result";
            case "IDEAL":
                return "ideal-merchant-transaction";
            case "EBA_SCT":
            case "EBA_SDD":
            case "BUNQ":
            default:
            // do nothing yet, check other properties first
        }

        // was a batched payment
        if (event.batch_id) return "payment-batch";

        return "payment";
    } else if (eventType === "RequestResponse") {
        return false;

        switch (event.type) {
            case "SOFORT":
                return "sofort-merchant-transaction";
            case "IDEAL":
                return "ideal-merchant-transaction";
            case "INTERNAL":
            case "DIRECT_DEBIT":
            case "DIRECT_DEBIT_B2B":
            default:
        }

        return "request-response";
    } else if (eventType === "RequestInquiry") {
        return false;

        if (event.batch_id) return "request-inquiry-batch";

        return "request-inquiry";
    }
};

// | "bunqme-fundraiser-result"
// | "draft-payment"
// | "ideal-merchant-transaction"
// | "mastercard-action"
// | "payment-batch"
// | "payment"
// | "request-inquiry-batch"
// | "request-inquiry"
// | "request-response"
// | "schedule"
// | "sofort-merchant-transaction"
// | "switch-service-payment"
// | "whitelist";
