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
    | "SavingsAutoSaveResult"
    | "IdealMerchantTransaction"
    | "InterestPayout"
    | "BunqMeFundraiserResult"
    | "BunqMeTabResultResponse"
    | "ScheduledInstance"
    | "TransferwisePayment";

export default interface EventType {
    eventType: EventTypeValue;
    getAmount: () => number;
    getDelta: () => number;
}
