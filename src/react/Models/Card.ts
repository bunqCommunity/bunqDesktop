import { getObjectType } from "../Functions/Utils";

import {
    Alias,
    CardType,
    CountryPermissionCollection,
    PinCodeAssignmentCollection,
    PrimaryAccountNumberCollection
} from "../Types/Types";

export default class Card {
    // the original raw object
    private _rawData: any;

    // account type of this monetary account
    private _cardType: CardType;

    public CardDebit: this;
    public CardCredit: this;

    // common fields
    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _card_limit: any;
    private _card_limit_atm: any;
    private _country: any;
    private _country_persmission: CountryPermissionCollection;
    private _expiry_date: string;
    private _label_monetary_account_current: Alias;
    private _label_monetary_account_ordered: Alias;
    private _monetary_account_id_fallback: null | number;
    private _name_on_card: string;
    private _order_status: string;
    private _pin_code_assignment: PinCodeAssignmentCollection;
    private _primary_account_number_four_digits: string;
    private _primary_account_numbers: PrimaryAccountNumberCollection;
    private _primary_account_numbers_virtual: PrimaryAccountNumberCollection;
    private _public_uuid: string;
    private _second_line: string;
    private _status: string;
    private _sub_status: string;
    private _sub_type: string;
    private _product_type: string;
    private _type: string;

    constructor(cardObject: any) {
        this._rawData = cardObject;

        // get the card type
        const type: any = getObjectType(cardObject);
        this._cardType = type;

        // get the direct object using the extracted account type
        const cardInfo: any = cardObject[this.cardType];

        // go through all keys and set the data
        Object.keys(cardInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = cardInfo[key];
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
     * Normal getters for all properties
     * @returns {number}
     */
    get cardType(): CardType {
        return this._cardType;
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

    get card_limit(): any {
        return this._card_limit;
    }

    get card_limit_atm(): any {
        return this._card_limit_atm;
    }

    get country(): any {
        return this._country;
    }

    get country_persmission(): any {
        return this._country_persmission;
    }

    get expiry_date(): string {
        return this._expiry_date;
    }

    get label_monetary_account_current(): Alias {
        return this._label_monetary_account_current;
    }

    get label_monetary_account_ordered(): Alias {
        return this._label_monetary_account_ordered;
    }

    get monetary_account_id_fallback(): number | null {
        return this._monetary_account_id_fallback;
    }

    get name_on_card(): string {
        return this._name_on_card;
    }

    get order_status(): string {
        return this._order_status;
    }

    get pin_code_assignment(): any {
        return this._pin_code_assignment;
    }

    get primary_account_number_four_digits(): string {
        return this._primary_account_number_four_digits;
    }

    get primary_account_numbers(): any[] {
        return this._primary_account_numbers;
    }

    get primary_account_numbers_virtual(): any {
        return this._primary_account_numbers_virtual;
    }

    get public_uuid(): string {
        return this._public_uuid;
    }

    get second_line(): string {
        return this._second_line;
    }

    get status(): string {
        return this._status;
    }

    get sub_status(): string {
        return this._sub_status;
    }

    get sub_type(): string {
        return this._sub_type;
    }

    get product_type(): string {
        return this._product_type;
    }

    get type(): string {
        return this._type;
    }
}
