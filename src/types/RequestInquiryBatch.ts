import { Amount, RequestSplitTheBill } from "~types/Types";

export interface IRequestInquiryBatch {
    RequestInquiryBatch: {
        id: number;
        created: Date;
        updated: Date;
        reference_split_the_bill: RequestSplitTheBill;
        request_inquiries: any[];
        total_amount_inquired: Amount;
    };
}
