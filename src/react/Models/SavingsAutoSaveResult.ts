import Payment from "./Payment";
import EventType, { EventTypeValue } from "../Types/Event";
import { BunqDesktopImageConfig } from "../Types/Types";

export type SavingsAutoSaveEntry = {
    created: Date;
    updated: Date;
    id: number;
    payment_original_event_id: number;
    payment_savings: Payment;
};

export default class SavingsAutoSaveResult implements EventType {
    // the original raw object
    public _rawData: any;

    public SavingsAutoSaveResult = this;
    get eventType(): EventTypeValue {
        return "SavingsAutoSaveResult";
    }

    public isTransaction: boolean = true;

    get mutations(): Payment[] {
        const paymentObjects = [];

        this.savings_auto_save_entries.forEach(savingsAutoSaveEntry => {
            paymentObjects.push(savingsAutoSaveEntry.payment_savings);

            // stringify and parse to get rid of all references ...
            const paymentReverse = JSON.parse(JSON.stringify(savingsAutoSaveEntry.payment_savings._rawData.Payment));
            const paymentReverseAlias = paymentReverse.alias;
            const paymentReverseCounterAlias = paymentReverse.counterparty_alias;

            // reverse alias and counter alias and amount
            paymentReverse.alias = paymentReverseCounterAlias;
            paymentReverse.counterparty_alias = paymentReverseAlias;
            paymentReverse.amount.value = parseFloat(paymentReverse.amount.value) * -1;

            paymentObjects.push(new Payment({ Payment: paymentReverse }));
        });

        return paymentObjects;
    }

    get image(): BunqDesktopImageConfig {
        if (this._savings_auto_save_entries.length > 0) {
            const firstSaving = this._savings_auto_save_entries[0];
            const firstPaymentObject: Payment = firstSaving.payment_savings;

            const aliasImageUuid: any = firstPaymentObject.getImageUuid("ALIAS");
            if (!aliasImageUuid) return false;

            return {
                type: "IMAGE_UUID",
                value: aliasImageUuid
            };
        }
        return false;
    }

    get eventCount(): number {
        return this._savings_auto_save_entries.length;
    }

    private _id: number;
    private _created: Date;
    private _savings_auto_save_entries: SavingsAutoSaveEntry[];
    private _updated: Date;

    constructor(eventObject: any) {
        this._rawData = eventObject;

        // get the direct object
        const eventInfo: any = eventObject.SavingsAutoSaveResult;

        // go through all keys and set the data
        Object.keys(eventInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = eventInfo[key];
        });

        this._savings_auto_save_entries = this._savings_auto_save_entries.map(savingsAutoSaveEntry => {
            return {
                created: new Date(savingsAutoSaveEntry.created),
                updated: new Date(savingsAutoSaveEntry.updated),
                id: savingsAutoSaveEntry.id,
                payment_original_event_id: savingsAutoSaveEntry.payment_original_event_id,
                payment_savings: new Payment({ Payment: savingsAutoSaveEntry.payment_savings })
            };
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
        return this._savings_auto_save_entries.reduce((totalSavings: any, savingsEntry: SavingsAutoSaveEntry) => {
            return totalSavings + savingsEntry.payment_savings.getAmount();
        }, 0);
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
    get savings_auto_save_entries(): SavingsAutoSaveEntry[] {
        return this._savings_auto_save_entries;
    }
    get rawData(): any {
        return this._rawData;
    }
}
