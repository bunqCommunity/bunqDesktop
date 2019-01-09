export type EventTypeValue =
    | "Event"
    | "Payment"
    | "BunqMeTab"
    | "MasterCardAction"
    | "RequestInquiry"
    | "RequestInquiryBatch"
    | "RequestResponse"
    | "Invoice"
    | "ScheduledPayment"
    | "IdealMerchantTransaction"
    | "BunqMeFundraiserResult"
    | "ScheduledInstance";

export default interface EventType {
    eventType: EventTypeValue;
    getAmount: () => number;
    getDelta: () => number;
}
