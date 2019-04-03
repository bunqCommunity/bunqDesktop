import EventType, { EventTypeValue } from "../Types/Event";
import ScheduledPayment from "./ScheduledPayment";
import Payment from "./Payment";

export default class ScheduledInstance implements EventType {
    // the original raw object
    public _rawData: any;

    public ScheduledInstance = this;
    get eventType(): EventTypeValue {
        return "ScheduledInstance";
    }

    get isTransaction(): boolean {
        return !!this._result_object;
    }

    get paymentObject(): Payment | any | false {
        if (!this.isTransaction) return false;

        return this._result_object;
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _time_end: Date | null;
    private _time_start: Date;
    private _state: "FINISHED_SUCCESSFULLY" | string;
    private _error_message: string | null;
    private _scheduled_object: ScheduledPayment;
    private _result_object: Payment;
    private _request_reference_split_the_bill: any;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.ScheduledInstance;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
        });

        if (this._result_object && this._result_object.Payment) {
            this._result_object = new Payment(this._result_object);
        }
        if (this._scheduled_object) {
            this._scheduled_object = new ScheduledPayment(this._scheduled_object);
        }

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
        this._time_end = new Date(this._time_end);
        this._time_start = new Date(this._time_start);
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
        if (this._result_object.Payment) {
            return this._result_object.getAmount();
        }
        return 0;
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        if (this._result_object.Payment) {
            return this._result_object.getDelta();
        }
        return 0;
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
    get time_end(): Date | null {
        return this._time_end;
    }
    get time_start(): Date {
        return this._time_start;
    }
    get state() {
        return this._state;
    }
    get error_message(): string | null {
        return this._error_message;
    }
    get scheduled_object(): ScheduledPayment {
        return this._scheduled_object;
    }
    get result_object(): Payment {
        return this._result_object;
    }
    get request_reference_split_the_bill(): any {
        return this._request_reference_split_the_bill;
    }
}
