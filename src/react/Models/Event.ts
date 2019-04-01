import { BunqDesktopImageConfig } from "../Types/Types";
import EventType, { EventTypeValue } from "../Types/Event";
import Payment from "./Payment";
import RequestInquiry from "./RequestInquiry";
import MasterCardAction from "./MasterCardAction";
import RequestResponse from "./RequestResponse";
import BunqMeTab from "./BunqMeTab";
import RequestInquiryBatch from "./RequestInquiryBatch";
import ScheduledInstance from "./ScheduledInstance";
import ScheduledPayment from "./ScheduledPayment";
import Invoice from "./Invoice";
import IdealMerchantTransaction from "./IdealMerchantTransaction";
import BunqMeFundraiserResult from "./BunqMeFundraiserResult";
import BunqMeTabResultResponse from "./BunqMeTabResultResponse";
import SavingsAutoSaveResult from "./SavingsAutoSaveResult";
import InterestPayout from "./InterestPayout";

export default class Event implements EventType {
    // the original raw object
    private _rawData: any;

    public Event = this;
    get eventType(): EventTypeValue {
        return "Event";
    }

    public getAmount(): number {
        if (typeof this.object.getAmount !== "undefined") {
            return this.object.getAmount();
        }
        return 0;
    }

    public getDelta(): number {
        if (typeof this.object.getDelta !== "undefined") {
            return this.object.getDelta();
        }
        return 0;
    }

    /**
     * Whether this event will be included in the exports and is shown as a transaction
     */
    get isTransaction(): boolean {
        return !!this.object.isTransaction;
    }

    get image(): BunqDesktopImageConfig {
        if (typeof this.object.image === "undefined") return false;

        return this.object.image;
    }

    get eventCount(): number | false {
        if (typeof this.object.eventCount === "undefined") return false;

        return this.object.eventCount;
    }

    get paymentObject(): Payment | false {
        if (typeof this.object.paymentObject === "undefined") return false;

        return this.object.paymentObject;
    }

    private _id: number;
    private _action: "CREATE" | "UPDATE";
    private _status: "FINALIZED";
    private _created: Date;
    private _updated: Date;
    private _object: any | EventType;
    private _updated_fields: any | null;
    private _user_id: number | null;
    private _monetary_account_id: number | null;
    private _type:
        | string
        | "Payment"
        | "BunqMeTab"
        | "MasterCardAction"
        | "RequestInquiry"
        | "RequestInquiryBatch"
        | "RequestResponse"
        | "ScheduledInstance"
        | "ScheduledPayment"
        | "InterestPayout"
        | "SavingsAutoSaveResult"
        | "Invoice"
        | "IdealMerchantTransaction"
        | "BunqMeFundraiserResult"
        | "BunqMeTabResultResponse"
        | "FeatureAnnouncement"
        | "ShareInviteBankInquiry"
        | "ShareInviteBankResponse";

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.Event;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];

            if (key === "_object" || key === "object") {
                this._type = Object.keys(this[objectKey])[0];

                switch (this._type) {
                    case "Payment":
                        this._object = new Payment(this._object);
                        break;
                    case "BunqMeTab":
                        this._object = new BunqMeTab(this._object);
                        break;
                    case "MasterCardAction":
                        this._object = new MasterCardAction(this._object);
                        break;
                    case "RequestInquiry":
                        this._object = new RequestInquiry(this._object);
                        break;
                    case "RequestInquiryBatch":
                        this._object = new RequestInquiryBatch(this._object);
                        break;
                    case "RequestResponse":
                        this._object = new RequestResponse(this._object);
                        break;
                    case "ScheduledInstance":
                        this._object = new ScheduledInstance(this._object);
                        break;
                    case "ScheduledPayment":
                        this._object = new ScheduledPayment(this._object);
                        break;
                    case "Invoice":
                        this._object = new Invoice(this._object);
                        break;
                    case "IdealMerchantTransaction":
                        this._object = new IdealMerchantTransaction(this._object);
                        break;
                    case "BunqMeFundraiserResult":
                        this._object = new BunqMeFundraiserResult(this._object);
                        break;
                    case "BunqMeTabResultResponse":
                        this._object = new BunqMeTabResultResponse(this._object);
                        break;
                    case "InterestPayout":
                        this._object = new InterestPayout(this._object);
                        break;
                    case "SavingsAutoSaveResult":
                        this._object = new SavingsAutoSaveResult(this._object);
                        break;
                    case "FeatureAnnouncement":
                    case "ShareInviteBankInquiry":
                    case "ShareInviteBankResponse":
                    default:
                    // don't do anything special for these
                }
            }
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
    }

    /**
     * Used to store this object in JSON
     * @returns {string}
     */
    public toJSON(): any {
        return this._rawData;
    }

    get id(): number {
        return this._id;
    }
    get type(): any {
        return this._type;
    }
    get created(): Date {
        return this._created;
    }
    get updated(): Date {
        return this._updated;
    }
    get object(): any {
        return this._object;
    }
    get user_id(): number | null {
        return this._user_id;
    }
    get status(): string {
        return this._status;
    }
    get action(): string {
        return this._action;
    }
    get monetary_account_id(): number | null {
        return this._monetary_account_id;
    }
    get description() {
        if (this.object && this.object.description) {
            return this.object.description;
        }
        return "";
    }
    get updated_fields() {
        return this._updated_fields;
    }
}
