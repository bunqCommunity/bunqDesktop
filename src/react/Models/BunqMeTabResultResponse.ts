import EventType, { EventTypeValue } from "../Types/Event";
import Payment from "./Payment";
import {BunqDesktopImageConfig, PaymentAlias} from "../Types/Types";

export default class BunqMeTabResultResponse implements EventType {
    // the original raw object
    public _rawData: any;

    public BunqMeTabResultResponse = this;
    get eventType(): EventTypeValue {
        return "BunqMeTabResultResponse";
    }

    public isTransaction: boolean = true;

    get image(): BunqDesktopImageConfig {
        return this.payment.image;
    }

    get paymentObject(): Payment | false {
        return this.payment;
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _payment: Payment;
    private _bunqme_fundraiser_profile: any;

    constructor(bunqMeTabObject: any) {
        this._rawData = bunqMeTabObject;

        // get the direct object
        const bunqMeTabInfo: any = bunqMeTabObject.BunqMeTabResultResponse;

        // go through all keys and set the data
        Object.keys(bunqMeTabInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            if (typeof this[objectKey] !== undefined) this[objectKey] = bunqMeTabInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);

        if (this.payment) {
            this._payment = new Payment(this.payment);
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
        return this.getTotalPaidAmount();
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        return this.getTotalPaidAmount();
    }

    /**
     * @returns {number}
     */
    public getTotalPaidAmount(): number {
        return this.payment.getAmount();
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
    get payment(): Payment {
        return this._payment;
    }
    get bunqme_fundraiser_profile(): any {
        return this._bunqme_fundraiser_profile;
    }
    get alias(): PaymentAlias {
        return this.payment.alias;
    }
    get counterparty_alias(): PaymentAlias {
        return this.payment.counterparty_alias;
    }
}
