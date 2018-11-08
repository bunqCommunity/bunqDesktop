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
    | "ScheduledInstance";

export default interface EventType {
    eventType: EventTypeValue;
}
