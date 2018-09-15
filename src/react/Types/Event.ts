export type EventType =
    | "Payment"
    | "BunqMeTab"
    | "MasterCardAction"
    | "RequestInquiry"
    | "RequestInquiryBatch"
    | "RequestResponse";

export default interface Event {
    eventType: EventType;
}
