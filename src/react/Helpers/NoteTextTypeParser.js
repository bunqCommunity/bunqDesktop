export default event => {
    console.log(event);
    const eventType = event.eventType;

    if (eventType === "Payment") {
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

        // was a scheduled payment
        if (event.scheduled_id) return "schedule";

        // was a batched payment
        if (event.batch_id) return "payment-batch";

        return "payment";
    } else if (eventType === "RequestResponse") {
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
        if (event.batch_id) return "request-inquiry-batch";

        return "request-inquiry";
    } else if (eventType === "MasterCardAction") {
        return "mastercard-action";
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
