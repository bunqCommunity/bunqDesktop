import { Amount, RequestSplitTheBill } from "../Types/Types";
import Event, { EventTypeValue } from "../Types/Event";
import RequestInquiry from "./RequestInquiry";

export default class RequestInquiryBatch implements Event {
    // the original raw object
    private _rawData: any;

    public RequestInquiryBatch = this;
    get eventType(): EventTypeValue {
        return "RequestInquiryBatch";
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _reference_split_the_bill: RequestSplitTheBill;
    private _request_inquiries: any[];
    private _total_amount_inquired: Amount;

    constructor(requestObject: any) {
        this._rawData = requestObject;

        // get the direct object
        const requestInfo: any = requestObject.RequestInquiryBatch;

        // go through all keys and set the data
        Object.keys(requestInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = requestInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);

        // overwrite the underlying request objects with our custom models
        this.request_inquiries.forEach((requestInquiry, key) => {
            // prevent wrapping existing model into another model
            const requestInquiryInfo =
                requestInquiry.RequestInquiry || requestInquiry.eventType
                    ? new RequestInquiry(requestInquiry)
                    : new RequestInquiry({
                          RequestInquiry: requestInquiry
                      });

            this.request_inquiries[key] = requestInquiryInfo;
        });
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
        return this.getTotalAmountInquired();
    }

    /**
     * @returns {number}
     */
    public getTotalAmountInquired(): number {
        return parseFloat(this.total_amount_inquired.value);
    }

    /**
     * @returns {number}
     */
    public getTotalAmountResponded(): number {
        return this.request_inquiries.reduce((accumulator, requestInquiry: RequestInquiry) => {
            return accumulator + requestInquiry.getDelta();
        }, 0);
    }

    /**
     * 0 change since this isn't an actual transaction
     * @returns {number}
     */
    public getDelta(): number {
        return this.getTotalAmountResponded();
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
    get reference_split_the_bill(): RequestSplitTheBill {
        return this._reference_split_the_bill;
    }
    get request_inquiries(): any[] {
        return this._request_inquiries;
    }
    get total_amount_inquired(): Amount {
        return this._total_amount_inquired;
    }
}
