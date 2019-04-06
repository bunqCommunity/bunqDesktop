import {
    Address,
    Amount,
    AttachmentList,
    BunqDesktopImageConfig,
    Geolocation,
    PaymentAlias,
    PaymentSubType,
    PaymentType,
    RequestReferenceSplitTheBill
} from "../Types/Types";
import EventType, { EventTypeValue } from "../Types/Event";

export default class Payment implements EventType {
    // the original raw object
    public _rawData: any;

    public Payment = this;
    get eventType(): EventTypeValue {
        return "Payment";
    }

    public isTransaction: boolean = true;

    get image(): BunqDesktopImageConfig {
        return {
            type: "IMAGE_UUID",
            value: this.getImageUuid("COUNTERPARTY")
        };
    }

    get mutations(): Payment[] {
        return [this];
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _monetary_account_id: number;
    private _amount: Amount;
    private _alias: PaymentAlias;
    private _counterparty_alias: PaymentAlias;
    private _description: string;
    private _type: PaymentType;
    private _sub_type: PaymentSubType;
    private _bunqto_status: string | null;
    private _bunqto_sub_status: string | null;
    private _bunqto_share_url: string | null;
    private _bunqto_expiry: string | null;
    private _bunqto_time_responded: string | null;
    private _attachment: AttachmentList;
    private _balance_after_mutation: Amount | undefined = undefined;
    private _merchant_reference: string;
    private _batch_id: number | null;
    private _scheduled_id: number | null;
    private _address_shipping: Address | null;
    private _address_billing: Address | null;
    private _geolocation: Geolocation;
    private _allow_chat: boolean;
    private _auto_save_entry: any;
    private _maturity_date: string;
    private _request_reference_split_the_bill: RequestReferenceSplitTheBill;

    constructor(paymentObject: any) {
        this._rawData = paymentObject;

        // get the direct object
        const paymentInfo: any = paymentObject.Payment;

        // go through all keys and set the data
        Object.keys(paymentInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = paymentInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);

        // ignore balance after mutation value for older payments
        if (this._balance_after_mutation) {
            if (this._balance_after_mutation.value === "999999999.99") {
                this._balance_after_mutation = undefined;
            }
        }
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
        return parseFloat(this.amount.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        return this.getAmount();
    }

    /**
     * Returns the image ID for the alias or counterparty_alias
     * @param type
     */
    public getImageUuid(type: "COUNTERPARTY" | "ALIAS") {
        let aliasObject: any | false = false;
        if (type === "COUNTERPARTY") {
            aliasObject = this.counterparty_alias;
        }

        if (type === "ALIAS") {
            aliasObject = this.alias;
        }

        if (aliasObject.avatar && aliasObject.avatar.image && aliasObject.avatar.image[0]) {
            return aliasObject.avatar.image[0].attachment_public_uuid;
        }
        return false;
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
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get amount(): Amount {
        return this._amount;
    }
    get alias(): PaymentAlias {
        return this._alias;
    }
    get counterparty_alias(): PaymentAlias {
        return this._counterparty_alias;
    }
    get description(): string {
        return this._description;
    }
    get type(): PaymentType {
        return this._type;
    }
    get sub_type(): PaymentSubType {
        return this._sub_type;
    }
    get bunqto_status(): string | null {
        return this._bunqto_status;
    }
    get bunqto_sub_status(): string | null {
        return this._bunqto_sub_status;
    }
    get bunqto_share_url(): string | null {
        return this._bunqto_share_url;
    }
    get bunqto_expiry(): string | null {
        return this._bunqto_expiry;
    }
    get bunqto_time_responded(): string | null {
        return this._bunqto_time_responded;
    }
    get attachment(): AttachmentList {
        return this._attachment;
    }
    get balance_after_mutation(): Amount | undefined {
        return this._balance_after_mutation;
    }
    get merchant_reference(): string {
        return this._merchant_reference;
    }
    get batch_id(): number | null {
        return this._batch_id;
    }
    get scheduled_id(): number | null {
        return this._scheduled_id;
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
    get auto_save_entry(): any {
        return this._auto_save_entry;
    }
    get maturity_date(): string {
        return this._maturity_date;
    }
    get request_reference_split_the_bill(): RequestReferenceSplitTheBill {
        return this._request_reference_split_the_bill;
    }

    set created(value: Date) {
        this._created = value;
    }
    set updated(value: Date) {
        this._updated = value;
    }
    set amount(value: Amount) {
        this._amount = value;
    }
}
