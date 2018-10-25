import { Amount, LabelCard, PaymentAlias, RequestReferenceSplitTheBill } from "../Types/Types";
import Event, { EventType } from "../Types/Event";

export type PanEntryModeUser = "ATM" | "ICC" | "MAGNETIC_STRIPE" | "E_COMMERCE";

export default class MasterCardAction implements Event {
    // the original raw object
    private _rawData: any;

    public MasterCardAction = this;
    get eventType(): EventType {
        return "MasterCardAction";
    }

    private _id: number;
    private _created: Date;
    private _updated: Date;
    private _monetary_account_id: number;
    private _card_id: number;
    private _amount_local: Amount;
    private _amount_billing: Amount;
    private _amount_original_local: Amount;
    private _amount_original_billing: Amount;
    private _amount_fee: Amount;
    private _decision: "ALLOWED" | string;
    private _decision_description: string;
    private _decision_description_translated: string;
    private _description: string;
    private _authorisation_status: string;
    private _authorisation_type: string;
    private _pan_entry_mode_user: PanEntryModeUser;
    private _city: string;
    private _alias: PaymentAlias;
    private _counterparty_alias: PaymentAlias;
    private _label_card: LabelCard;
    private _token_status: string;
    private _reservation_expiry_time: string;
    private _applied_limit: string;
    private _allow_chat: boolean;
    private _eligible_whitelist_id: number;
    private _wallet_provider_id: string;
    private _secure_code_id: number;
    private _request_reference_split_the_bill: RequestReferenceSplitTheBill;

    constructor(masterCardActionObject: any) {
        this._rawData = masterCardActionObject;

        // get the direct object
        const masterCardActionInfo: any = masterCardActionObject.MasterCardAction;

        // go through all keys and set the data
        Object.keys(masterCardActionInfo).forEach(key => {
            const objectKey = key[0] === "_" ? key : `_${key}`;
            this[objectKey] = masterCardActionInfo[key];
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
        return parseFloat(this.amount_billing.value);
    }

    /**
     * Returns the change in account balance if any based on this object's data
     * @returns {number}
     */
    public getDelta(): number {
        const validTypes = [
            "ACQUIRER_AUTHORISED",
            "AUTHORISED",
            "AUTHORISED_PARTIAL",
            "CLEARING_REFUND",
            "PRE_AUTHORISATION_FINALISED",
            "PRE_AUTHORISED",
            "STAND_IN_AUTHORISED",
            "UNAUTHORISED_CLEARING"
        ];

        // check if auth status means the payment completed
        if (!validTypes.includes(this.authorisation_status)) {
            return 0;
        }

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
    get monetary_account_id(): number {
        return this._monetary_account_id;
    }
    get card_id(): number {
        return this._card_id;
    }
    get amount_local(): Amount {
        return this._amount_local;
    }
    get amount_billing(): Amount {
        return this._amount_billing;
    }
    get amount_original_local(): Amount {
        return this._amount_original_local;
    }
    get amount_original_billing(): Amount {
        return this._amount_original_billing;
    }
    get amount_fee(): Amount {
        return this._amount_fee;
    }
    get decision() {
        return this._decision;
    }
    get decision_description(): string {
        return this._decision_description;
    }
    get decision_description_translated(): string {
        return this._decision_description_translated;
    }
    get description(): string {
        return this._description;
    }
    get authorisation_status(): string {
        return this._authorisation_status;
    }
    get authorisation_type(): string {
        return this._authorisation_type;
    }
    get pan_entry_mode_user(): PanEntryModeUser {
        return this._pan_entry_mode_user;
    }
    get city(): string {
        return this._city;
    }
    get alias(): PaymentAlias {
        return this._alias;
    }
    get counterparty_alias(): PaymentAlias {
        return this._counterparty_alias;
    }
    get label_card(): LabelCard {
        return this._label_card;
    }
    get token_status(): string {
        return this._token_status;
    }
    get reservation_expiry_time(): string {
        return this._reservation_expiry_time;
    }
    get applied_limit(): string {
        return this._applied_limit;
    }
    get allow_chat(): boolean {
        return this._allow_chat;
    }
    get eligible_whitelist_id(): number {
        return this._eligible_whitelist_id;
    }
    get wallet_provider_id(): string {
        return this._wallet_provider_id;
    }
    get secure_code_id(): number {
        return this._secure_code_id;
    }
    get request_reference_split_the_bill(): RequestReferenceSplitTheBill {
        return this._request_reference_split_the_bill;
    }
}
