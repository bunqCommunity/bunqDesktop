import {
    Address,
    Amount,
    AttachmentList,
    ExtendedAlias,
    Geolocation,
    PaymentAlias,
    RequestStatus,
    RequestSplitTheBill
} from "../Types/Types";
import Event, { EventTypeValue } from "../Types/Event";

export default class RequestInquiry implements Event {
    // the original raw object
    private _rawData: any;

    public RequestInquiry = this;
    get eventType(): EventTypeValue {
        return "RequestInquiry";
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _time_responded: Date;
    private _time_expiry: Date;
    private _monetary_account_id: number;
    private _amount_inquired: Amount;
    private _amount_responded: null | Amount;
    private _user_alias_created: ExtendedAlias;
    private _user_alias_revoked: null | ExtendedAlias;
    private _counterparty_alias: PaymentAlias;
    private _description: string;
    private _merchant_reference: string;
    private _attachment: AttachmentList;
    private _status: RequestStatus;
    private _batch_id: null | number;
    private _bunqme_share_url: string;
    private _scheduled_id: null | number;
    private _minimum_age: null | number;
    private _require_address: string;
    private _redirect_url: null | string;
    private _address_shipping: Address | null;
    private _address_billing: Address | null;
    private _geolocation: Geolocation;
    private _allow_chat: boolean;
    private _request_reference_split_the_bill: RequestSplitTheBill;

    constructor(requestObject: any) {
        this._rawData = requestObject;

        // get the direct object
        const requestInfo: any = requestObject.RequestInquiry;

        // go through all keys and set the data
        Object.keys(requestInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = requestInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
        this._time_responded = this._time_responded ? new Date(this._time_responded) : this._time_responded;
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
        return parseFloat(this.amount_inquired.value);
    }

    /**
     * @returns {number}
     */
    public getAmountResponded(): number {
        return parseFloat(this.amount_responded.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        const noDeltaStatusList = ["PENDING", "REJECTED", "REVOKED", "EXPIRED"];
        if (noDeltaStatusList.includes(this.status)) {
            return 0;
        }

        // inquiry means we sent money so amount negative
        return this.getAmountResponded();
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
    get time_responded(): Date {
        return this._time_responded;
    }
    get time_expiry(): Date {
        return this._time_expiry;
    }
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get amount_inquired(): Amount {
        return this._amount_inquired;
    }
    get amount_responded(): Amount | null {
        return this._amount_responded;
    }
    get user_alias_created(): ExtendedAlias {
        return this._user_alias_created;
    }
    get user_alias_revoked(): ExtendedAlias | null {
        return this._user_alias_revoked;
    }
    get counterparty_alias(): PaymentAlias {
        return this._counterparty_alias;
    }
    get description(): string {
        return this._description;
    }
    get merchant_reference(): string {
        return this._merchant_reference;
    }
    get attachment(): AttachmentList {
        return this._attachment;
    }
    get status(): RequestStatus {
        return this._status;
    }
    get batch_id(): number | null {
        return this._batch_id;
    }
    get bunqme_share_url(): string | null {
        return this._bunqme_share_url;
    }
    get scheduled_id(): number | null {
        return this._scheduled_id;
    }
    get minimum_age(): number | null {
        return this._minimum_age;
    }
    get require_address(): string {
        return this._require_address;
    }
    get address_shipping(): Address | null {
        return this._address_shipping;
    }
    get address_billing(): Address | null {
        return this._address_billing;
    }
    get geolocation(): Geolocation {
        return this._geolocation;
    }
    get allow_chat(): boolean {
        return this._allow_chat;
    }
    get request_reference_split_the_bill(): RequestSplitTheBill {
        return this._request_reference_split_the_bill;
    }
}
