import Payment from "./Payment";
import { Amount, BunqDesktopImageConfig } from "../Types/Types";
import EventType, { EventTypeValue } from "../Types/Event";

export default class InterestPayout implements EventType {
    // the original raw object
    public _rawData: any;

    public InterestPayout = this;
    get eventType(): EventTypeValue {
        return "InterestPayout";
    }

    get isTransaction(): boolean {
        return true;
    }

    get image(): BunqDesktopImageConfig {
        return {
            type: "LOCATION",
            value: "./images/svg/bunq-placeholders/Interest_badge.svg"
        };
    }

    get paymentObject(): Payment | false {
        return this.payment;
    }

    private _id: number;
    private _amount: Amount;
    private _amount_total: Amount;
    private _created: Date;
    private _payment: Payment;
    private _updated: Date;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.InterestPayout;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
        });

        this._payment = new Payment({ Payment: this._payment });
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
        if (this.payment) {
            return this.payment.getDelta();
        }
        return 0;
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
    get created(): Date {
        return this._created;
    }
    get updated(): Date {
        return this._updated;
    }
    get rawData(): any {
        return this._rawData;
    }
    get amount(): Amount {
        return this._amount;
    }
    get amount_total(): Amount {
        return this._amount_total;
    }
    get payment(): Payment {
        return this._payment;
    }
}
