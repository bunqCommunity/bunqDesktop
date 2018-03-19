export type TypeRule = {
    ruleType: "ITEM_TYPE";
    matchType: TypeRuleMatchType;
};

export type TypeRuleMatchType =
    | "PAYMENT"
    | "PAYMENT_RECEIVED"
    | "PAYMENT_SENT"
    | "REGULAR_PAYMENT"
    | "MASTERCARD_PAYMENT"
    | "REQUEST"
    | "REQUEST_INQUIRY"
    | "REQUEST_RESPONSE"
    | "BUNQ_ME_TAB";

export default TypeRule;
