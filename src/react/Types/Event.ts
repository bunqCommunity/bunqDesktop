export type EventType =
    | "Payment"
    | "BunqMeTab"
    | "MasterCardAction"
    | "RequestInquiry"
    | "RequestResponse";

export default interface Event {
    eventType: EventType;
}
