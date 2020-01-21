import {
    Address,
    Amount,
    AttachmentList,
    ExtendedAlias,
    Geolocation,
    PaymentAlias,
    RequestSplitTheBill,
    RequestStatus
} from "~types/Types";

export interface IRequestInquiry {
    id: number;
    created: Date;
    updated: Date;
    time_responded: Date;
    time_expiry: Date;
    monetary_account_id: number;
    amount_inquired: Amount;
    amount_responded: null | Amount;
    user_alias_created: ExtendedAlias;
    user_alias_revoked: null | ExtendedAlias;
    counterparty_alias: PaymentAlias;
    description: string;
    merchant_reference: string;
    attachment: AttachmentList;
    status: RequestStatus;
    batch_id: null | number;
    bunqme_share_url: string;
    scheduled_id: null | number;
    minimum_age: null | number;
    require_address: string;
    redirect_url: null | string;
    address_shipping: Address | null;
    address_billing: Address | null;
    geolocation: Geolocation;
    allow_chat: boolean;
    request_reference_split_the_bill: RequestSplitTheBill;
}
