import {
    BunqMeTabEntry,
    BunqMeTabResultInquiry,
    BunqMeTabStatus
} from "../Types/Types";
import Event, { EventType } from "../Types/Event";

export default class BunqMeTab implements Event {
    // the original raw object
    private _rawData: any;

    public BunqMeTab = this;
    get eventType(): EventType {
        return "BunqMeTab";
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _time_expiry: Date;
    private _monetary_account_id: number;
    private _status: BunqMeTabStatus;
    private _bunqme_tab_share_url: string;
    private _bunqme_tab_entry: BunqMeTabEntry;
    private _result_inquiries: BunqMeTabResultInquiry[];

    constructor(paymentObject: any) {
        this._rawData = paymentObject;

        // get the direct object
        const paymentInfo: any = paymentObject.BunqMeTab;

        // go through all keys and set the data
        Object.keys(paymentInfo).forEach(key => {
            if (typeof this[`_${key}`] !== undefined)
                this[`_${key}`] = paymentInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
        this._time_expiry = new Date(this._time_expiry);
    }

    /**
     * Used to store this object in JSON
     * @returns {string}
     */
    public toJSON(): any {
        return this._rawData;
    }

    /**
     * @returns {number}
     */
    public getAmount(): number {
        return parseFloat(this.bunqme_tab_entry.amount_inquired.value);
    }

    get id(): number {
        return this._id;
    }
    get created(): Date {
        return this._created;
    }
    get updated(): Date {
        return this._updated;
    }
    get time_expiry(): Date {
        return this._time_expiry;
    }
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get status(): BunqMeTabStatus {
        return this._status;
    }
    get bunqme_tab_share_url(): string {
        return this._bunqme_tab_share_url;
    }
    get bunqme_tab_entry(): BunqMeTabEntry {
        return this._bunqme_tab_entry;
    }
    get result_inquiries(): BunqMeTabResultInquiry[] {
        return this._result_inquiries;
    }
}
