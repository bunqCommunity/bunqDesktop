import EventType, { EventTypeValue } from "../Types/Event";
import Payment from "./Payment";
import { BunqDesktopImageConfig } from "../Types/Types";

export default class BunqMeFundraiserResult implements EventType {
    // the original raw object
    public _rawData: any;

    public BunqMeFundraiserResult = this;
    get eventType(): EventTypeValue {
        return "BunqMeFundraiserResult";
    }

    get isTransaction(): boolean {
        return this.payments && this.payments.length > 0;
    }

    get image(): BunqDesktopImageConfig {
        if (this.payments.length > 0) {
            return this.payments[0].image;
        }
        return false;
    }

    get eventCount(): number {
        return this.payments.length;
    }

    get mutations(): Payment[] {
        return this.payments;
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _payments: Payment[];
    private _bunqme_fundraiser_profile: any;

    constructor(bunqMeTabObject: any) {
        this._rawData = bunqMeTabObject;

        // get the direct object
        const bunqMeTabInfo: any = bunqMeTabObject.BunqMeFundraiserResult;

        // go through all keys and set the data
        Object.keys(bunqMeTabInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            if (typeof this[objectKey] !== undefined) this[objectKey] = bunqMeTabInfo[key];
        });

        this._payments = this._payments.map(payment => {
            return new Payment({ Payment: payment });
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
        return this.payments.reduce((accumulator: number, payment: Payment) => {
            const paymentAmount = parseFloat(payment.amount.value);
            return accumulator + paymentAmount;
        }, 0);
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
    get payments(): Payment[] {
        return this._payments;
    }
    get bunqme_fundraiser_profile(): any {
        return this._bunqme_fundraiser_profile;
    }
}
