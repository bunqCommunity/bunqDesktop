import {
    Address,
    Amount,
    AttachmentList,
    Geolocation,
    PaymentAlias,
    RequestStatus,
    RequestSplitTheBill,
    RequestResponseType,
    RequestResponseSubType
} from "../Types/Types";
import Event, { EventTypeValue } from "../Types/Event";

export default class RequestResponse implements Event {
    // the original raw object
    private _rawData: any;

    public RequestResponse = this;
    get eventType(): EventTypeValue {
        return "RequestResponse";
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _time_responded: Date;
    private _time_expiry: Date;
    private _monetary_account_id: number;
    private _amount_inquired: Amount;
    private _amount_responded: null | Amount;
    private _status: RequestStatus;
    private _description: string;
    private _alias: PaymentAlias;
    private _counterparty_alias: PaymentAlias;
    private _attachment: AttachmentList;
    private _minimum_age: null | number;
    private _require_address: string;
    private _geolocation: Geolocation;
    private _type: RequestResponseType;
    private _sub_type: RequestResponseSubType;
    private _redirect_url: null | string;
    private _address_shipping: Address | null;
    private _address_billing: Address | null;
    private _allow_chat: boolean;
    private _credit_scheme_identifier: string;
    private _mandate_identifier: string;
    private _eligible_whitelist_id: null | number;
    private _request_reference_split_the_bill: RequestSplitTheBill;

    constructor(requestObject: any) {
        this._rawData = requestObject;

        // get the direct object
        const requestInfo: any = requestObject.RequestResponse;

        // go through all keys and set the data
        Object.keys(requestInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = requestInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
        this._time_responded = this._time_responded ? new Date(this._time_responded) : this._time_responded;
        this._time_expiry = this._time_expiry ? new Date(this._time_expiry) : this._time_expiry;
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
        return -parseFloat(this.amount_responded.value);
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
    get status(): RequestStatus {
        return this._status;
    }
    get description(): string {
        return this._description;
    }
    get alias(): PaymentAlias {
        return this._alias;
    }
    get counterparty_alias(): PaymentAlias {
        return this._counterparty_alias;
    }
    get attachment(): AttachmentList {
        return this._attachment;
    }
    get minimum_age(): number | null {
        return this._minimum_age;
    }
    get require_address(): string {
        return this._require_address;
    }
    get geolocation(): Geolocation {
        return this._geolocation;
    }
    get type(): RequestResponseType {
        return this._type;
    }
    get sub_type(): RequestResponseSubType {
        return this._sub_type;
    }
    get redirect_url(): string | null {
        return this._redirect_url;
    }
    get address_shipping(): Address | null {
        return this._address_shipping;
    }
    get address_billing(): Address | null {
        return this._address_billing;
    }
    get allow_chat(): boolean {
        return this._allow_chat;
    }
    get credit_scheme_identifier(): string {
        return this._credit_scheme_identifier;
    }
    get mandate_identifier(): string {
        return this._mandate_identifier;
    }
    get eligible_whitelist_id(): number | null {
        return this._eligible_whitelist_id;
    }
    get request_reference_split_the_bill(): RequestSplitTheBill {
        return this._request_reference_split_the_bill;
    }
}
