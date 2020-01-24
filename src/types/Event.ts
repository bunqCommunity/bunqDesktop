export type EventTypeValue =
    | "Event"
    | "Payment"
    | "BunqMeTab"
    | "MasterCardAction"
    | "RequestInquiry"
    | "RequestInquiryBatch"
    | "RequestResponse";

export default interface EventType {
    eventType: EventTypeValue;
}
