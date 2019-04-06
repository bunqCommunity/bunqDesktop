import { BunqDesktopImageConfig } from "./Types";

export type EventTypeValue =
    | "BunqMeFundraiserResult"
    | "BunqMeTab"
    | "BunqMeTabResultResponse"
    | "Event"
    | "FeatureAnnouncement"
    | "IdealMerchantTransaction"
    | "InterestPayout"
    | "Invoice"
    | "MasterCardAction"
    | "Payment"
    | "RequestInquiry"
    | "RequestInquiryBatch"
    | "RequestResponse"
    | "SavingsAutoSaveResult"
    | "ScheduledInstance"
    | "ScheduledPayment"
    | "ShareInviteBankInquiry"
    | "ShareInviteBankResponse"
    | "TransferwisePayment";

export default interface EventType {
    eventType: EventTypeValue;
    mutations: any[];
    isTransaction: boolean;
    image: BunqDesktopImageConfig;
    getAmount: () => number;
    getDelta: () => number;
}
