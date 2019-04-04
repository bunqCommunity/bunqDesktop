import { Amount, LabelCard, PaymentAlias, TransferwisePaymentAlias } from "../Types/Types";
import EventType, { EventTypeValue } from "../Types/Event";

export default class TransferwisePayment implements EventType {
    // the original raw object
    public _rawData: any;

    public TransferwisePayment = this;
    get eventType(): EventTypeValue {
        return "TransferwisePayment";
    }

    public isTransaction: boolean = true;

    get paymentObject(): any | false {
        return this;
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _alias: PaymentAlias;
    private _amount_source: Amount;
    private _amount_target: Amount;
    private _counterparty_alias: TransferwisePaymentAlias;
    private _pay_in_reference: string;
    private _qoute: any;
    private _rate: number;
    private _reference: string;
    private _status: string | "COMPLETED";
    private _status_transferwise: string;
    private _status_transferwise_issue: string | "NO_ISSUE";
    private _sub_status: string | "SETTLED";
    private _time_delivery_estimate: string | "SETTLED";

    constructor(transferwisePaymentObject: any) {
        this._rawData = transferwisePaymentObject;

        // get the direct object
        const transferwisePaymentInfo: any = transferwisePaymentObject.TransferwisePayment;

        // go through all keys and set the data
        Object.keys(transferwisePaymentInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = transferwisePaymentInfo[key];
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
        return parseFloat(this.amount_source.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        // const validTypes = [
        //     "ACQUIRER_AUTHORISED",
        //     "AUTHORISED",
        //     "AUTHORISED_PARTIAL",
        //     "CLEARING_REFUND",
        //     "PRE_AUTHORISATION_FINALISED",
        //     "PRE_AUTHORISED",
        //     "STAND_IN_AUTHORISED",
        //     "UNAUTHORISED_CLEARING"
        // ];
        //
        // // check if auth status means the payment completed
        // if (!validTypes.includes(this.authorisation_status)) {
        //     return 0;
        // }

        // mastercard payments means we sent money
        return this.getAmount() * -1;
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
    get alias(): PaymentAlias {
        return this._alias;
    }
    get amount_source(): Amount {
        return this._amount_source;
    }
    get amount_target(): Amount {
        return this._amount_target;
    }
    get counterparty_alias(): TransferwisePaymentAlias {
        return this._counterparty_alias;
    }
    get pay_in_reference(): string {
        return this._pay_in_reference;
    }
    get qoute(): any {
        return this._qoute;
    }
    get rate(): number {
        return this._rate;
    }
    get reference(): string {
        return this._reference;
    }
    get status(): string | "COMPLETED" {
        return this._status;
    }
    get status_transferwise(): string {
        return this._status_transferwise;
    }
    get status_transferwise_issue(): string | "NO_ISSUE" {
        return this._status_transferwise_issue;
    }
    get sub_status(): string | "SETTLED" {
        return this._sub_status;
    }
    get time_delivery_estimate(): string | "SETTLED" {
        return this._time_delivery_estimate;
    }
}
