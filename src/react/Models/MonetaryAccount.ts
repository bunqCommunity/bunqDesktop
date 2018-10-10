import { AccountType, MonetaryAccountSetting, AllCoOwner, Alias, Avatar, Balance, Amount } from "../Types/Types";

import NotificationFilter from "@bunq-community/bunq-js-client/src/Types/NotificationFilter";

export default class MonetaryAccount {
    // the original raw object
    private _rawData: any;

    // account type of this monetary account
    private _accountType: AccountType;

    // common fields
    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _avatar: Avatar;
    private _currency: "EUR";
    private _description: string;
    private _daily_limit: Amount;
    private _daily_spent: Amount;
    private _overdraft_limit: Amount;
    private _balance: Balance;
    private _alias: Alias[];
    private _public_uuid: string;
    private _status: "ACTIVE" | "BLOCKED" | "CANCELLED" | "PENDING_REOPEN";
    private _sub_status: string;
    private _user_id: number;
    private _monetary_account_profile: any;
    private _notification_filters: NotificationFilter[];
    private _setting: MonetaryAccountSetting;

    // only available on MonetaryAccountJoint objects
    private _all_co_owner: AllCoOwner | undefined;

    constructor(monetaryAccountObject: any) {
        this._rawData = monetaryAccountObject;
        // get the account type
        this._accountType = this.getAccountType(monetaryAccountObject);

        // get the direct object using the extracted account tpye
        const accountInfo: any = monetaryAccountObject[this.accountType];

        // go through all keys and set the data
        Object.keys(accountInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = accountInfo[key];
        });

        this._updated = new Date(this._updated);
        this._created = new Date(this._created);
    }

    /**
     * Returns a string with the type of this monetary account object
     * @param monetaryAccountObject
     * @returns {AccountType}
     */
    private getAccountType(monetaryAccountObject: any): AccountType {
        const accountTypes: any[] = Object.keys(monetaryAccountObject);
        return accountTypes[0];
    }

    /**
     * Used to store this object in JSON
     * @returns {string}
     */
    public toJSON(): any {
        return this._rawData;
    }

    /**
     * Returns the current account balance as float
     * @returns {number}
     */
    public getBalance(): number {
        if (!this.balance) return 0;
        return parseFloat(this.balance.value);
    }

    /**
     * Normal getters for all properties
     * @returns {number}
     */
    get accountType(): AccountType {
        return this._accountType;
    }
    get raw(): any {
        return this._rawData;
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

    get avatar(): Avatar {
        return this._avatar;
    }

    get currency() {
        return this._currency;
    }

    get description(): string {
        return this._description;
    }

    get daily_limit(): Amount {
        return this._daily_limit;
    }

    get daily_spent(): Amount {
        return this._daily_spent;
    }

    get overdraft_limit(): Amount {
        return this._overdraft_limit;
    }

    get balance(): Balance {
        return this._balance;
    }

    get alias(): Alias[] {
        return this._alias;
    }

    get public_uuid(): string {
        return this._public_uuid;
    }

    get status() {
        return this._status;
    }

    get sub_status(): string {
        return this._sub_status;
    }

    get user_id(): number {
        return this._user_id;
    }

    get monetary_account_profile(): any {
        return this._monetary_account_profile;
    }

    get notification_filters(): NotificationFilter[] {
        return this._notification_filters;
    }

    get setting(): MonetaryAccountSetting {
        return this._setting;
    }

    get all_co_owner(): AllCoOwner | undefined {
        return this._all_co_owner;
    }
}
