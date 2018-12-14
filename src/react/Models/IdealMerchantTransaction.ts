import EventType, { EventTypeValue } from "../Types/Event";
import { Amount, GenericAlias } from "../Types/Types";

export default class IdealMerchantTransaction implements EventType {
    // the original raw object
    private _rawData: any;

    public IdealMerchantTransaction = this;
    get eventType(): EventTypeValue {
        return "IdealMerchantTransaction";
    }

    private _id: number;
    private _alias: GenericAlias; // TODO
    private _allow_chat: boolean;
    private _amount_guaranteed: Amount;
    private _amount_requested: Amount;
    private _counterparty_alias: GenericAlias; // TODO
    private _created: Date;
    private _issuer: string;
    private _issuer_authentication_url: string;
    private _issuer_name: string;
    private _monetary_account_id: number;
    private _purchase_identifier: string;
    private _status: string;
    private _transaction_identifier: string;
    private _updated: Date;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.IdealMerchantTransaction;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
        });

        // this._payment = new Payment({ Payment: this._payment });
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
        return parseFloat(this.amount_guaranteed.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        return this.getAmount();
    }

    get id(): number {
        return this._id;
    }

    get rawData(): any {
        return this._rawData;
    }

    get alias(): any {
        return this._alias;
    }

    get allow_chat(): boolean {
        return this._allow_chat;
    }

    get amount_guaranteed(): Amount {
        return this._amount_guaranteed;
    }
    get amount_requested(): Amount {
        return this._amount_requested;
    }
    get counterparty_alias(): any {
        return this._counterparty_alias;
    }
    get created(): Date {
        return this._created;
    }
    get issuer(): string {
        return this._issuer;
    }
    get issuer_authentication_url(): string {
        return this._issuer_authentication_url;
    }
    get issuer_name(): string {
        return this._issuer_name;
    }
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get purchase_identifier(): string {
        return this._purchase_identifier;
    }
    get status(): string {
        return this._status;
    }
    get transaction_identifier(): string {
        return this._transaction_identifier;
    }
    get updated(): Date {
        return this._updated;
    }
}
