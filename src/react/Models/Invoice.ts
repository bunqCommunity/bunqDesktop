import { Address, Amount, BunqDesktopImageConfig, GenericAlias, RequestReferenceSplitTheBill } from "../Types/Types";
import EventType, { EventTypeValue } from "../Types/Event";

export default class Invoice implements EventType {
    // the original raw object
    public _rawData: any;

    public Invoice = this;
    get eventType(): EventTypeValue {
        return "Invoice";
    }

    public isTransaction: boolean = true;

    get image(): BunqDesktopImageConfig {
        return {
            type: "IMAGE_UUID",
            value: this.getImageUuid("COUNTERPARTY")
        };
    }

    get mutations(): any[] {
        return [this];
    }

    private _id: number;
    private _address: Address | null;
    private _alias: GenericAlias;
    private _chamber_of_commerce_number: string;
    private _counterparty_address: Address;
    private _counterparty_alias: GenericAlias;
    private _created: Date;
    private _invoice_date: string;
    private _invoice_number: number;
    private _request_reference_split_the_bill: RequestReferenceSplitTheBill;
    private _total_vat: Amount;
    private _total_vat_exclusive: Amount;
    private _total_vat_inclusive: Amount;
    private _updated: Date;
    private _vat_number: string;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.Invoice;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
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

    /**
     * @returns {number}
     */
    public getAmount(): number {
        return parseFloat(this.total_vat_inclusive.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        return -this.getAmount();
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

    get rawData(): any {
        return this._rawData;
    }
    get id(): number {
        return this._id;
    }
    get address(): Address | null {
        return this._address;
    }
    get alias(): GenericAlias {
        return this._alias;
    }
    get chamber_of_commerce_number(): string {
        return this._chamber_of_commerce_number;
    }
    get counterparty_address(): Address {
        return this._counterparty_address;
    }
    get counterparty_alias(): GenericAlias {
        return this._counterparty_alias;
    }
    get created(): Date {
        return this._created;
    }
    get invoice_date(): string {
        return this._invoice_date;
    }
    get invoice_number(): number {
        return this._invoice_number;
    }
    get request_reference_split_the_bill(): RequestReferenceSplitTheBill {
        return this._request_reference_split_the_bill;
    }
    get total_vat(): Amount {
        return this._total_vat;
    }
    get total_vat_exclusive(): Amount {
        return this._total_vat_exclusive;
    }
    get total_vat_inclusive(): Amount {
        return this._total_vat_inclusive;
    }
    get updated(): Date {
        return this._updated;
    }
    get vat_number(): string {
        return this._vat_number;
    }
}
