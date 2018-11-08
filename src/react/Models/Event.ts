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

export default class Event implements EventType {
    // the original raw object
    private _rawData: any;

    public Event = this;
    get eventType(): EventTypeValue {
        return "Event";
    }

    private _id: number;
    private _action: "CREATE" | "UPDATE";
    private _status: "FINALIZED";
    private _created: Date;
    private _updated: Date;
    private _object: any;
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
        | "RequestResponse";

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
    get updated_fields() {
        return this._updated_fields;
    }
}
