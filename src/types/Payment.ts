import {
    Address,
    Amount,
    AttachmentList,
    Geolocation,
    PaymentAlias,
    PaymentSubType,
    PaymentType,
    RequestReferenceSplitTheBill
} from "~types/Types";

export interface IPayment {
    Payment: {
        id: number;
        created: Date;
        updated: Date;
        monetary_account_id: number;
        amount: Amount;
        alias: PaymentAlias;
        counterparty_alias: PaymentAlias;
        description: string;
        type: PaymentType;
        sub_type: PaymentSubType;
        bunqto_status: string | null;
        bunqto_sub_status: string | null;
        bunqto_share_url: string | null;
        bunqto_expiry: string | null;
        bunqto_time_responded: string | null;
        attachment: AttachmentList;
        balance_after_mutation: Amount | undefined;
        merchant_reference: string;
        batch_id: number | null;
        scheduled_id: number | null;
        address_shipping: Address | null;
        address_billing: Address | null;
        geolocation: Geolocation;
        allow_chat: boolean;
        request_reference_split_the_bill: RequestReferenceSplitTheBill;
    };
}
