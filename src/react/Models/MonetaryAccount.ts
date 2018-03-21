import { ExtendedAlias, Alias, Avatar, Balance } from "../Types/Types";

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
    private _description: string;
    private _balance: Balance;
    private _alias: Alias[];
    private _status: string;
    private _sub_status: string;
    private _user_id: number;
    private _setting: MonetaryAccountSetting;

    // only available on MonetaryAccountJoint objects
    private _all_co_owner: AllCoOwner | undefined;

    constructor(monetaryAccountObject: any) {
        this._rawData = monetaryAccountObject;
        // get the account type
        this._accountType = this.getAccountType(monetaryAccountObject);

        // get the direct object using the extracted account tpye
        const accountInfo: any = monetaryAccountObject[this.accountType];

        this._id = accountInfo.id;
        this._created = accountInfo.created;
        this._updated = accountInfo.updated;
        this._avatar = accountInfo.avatar;
        this._description = accountInfo.description;
        this._balance = accountInfo.balance;
        this._alias = accountInfo.alias;
        this._status = accountInfo.status;
        this._sub_status = accountInfo.sub_status;
        this._user_id = accountInfo.user_id;
        this._setting = accountInfo.setting;

        if (this._accountType === "MonetaryAccountJoint") {
        }
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
    public toJSON(): string {
        return this._rawData;
    }

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
    get description(): string {
        return this._description;
    }
    get balance(): Balance {
        return this._balance;
    }
    get alias(): Alias[] {
        return this._alias;
    }
    get status(): string {
        return this._status;
    }
    get sub_status(): string {
        return this._sub_status;
    }
    get user_id(): number {
        return this._user_id;
    }
    get setting(): MonetaryAccountSetting {
        return this._setting;
    }
    get all_co_owner(): AllCoOwner|undefined{
        return this._all_co_owner;
    }
}

export type AccountType =
    | "MonetaryAccountLight"
    | "MonetaryAccountBank"
    | "MonetaryAccountJoint";

export type MonetaryAccountSetting = {
    color: string;
    default_avatar_status:
        | "AVATAR_DEFAULT"
        | "AVATAR_CUSTOM"
        | "AVATAR_UNDETERMINED";
    restriction_chat: "ALLOW_INCOMING" | "BLOCK_INCOMING";
};

export type AllCoOwnerItem = {
    alias: ExtendedAlias[];
    status: "ACCEPTED" | "REJECTED" | "PENDING" | "REVOKED";
};

export type AllCoOwner = AllCoOwnerItem[];
