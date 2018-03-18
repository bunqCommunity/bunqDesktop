export type TypeRule = {
    ruleType: "ITEM_TYPE";
    matchType: TypeRuleMatchType;
};

export type TypeRuleMatchType =
    | "PAYMENT"
    | "BUNQ_ME_TAB"
    | "PAYMENT"
    | "REGULAR_PAYMENT"
    | "MASTERCARD_PAYMENT"
    | "REQUEST"
    | "REQUEST_INQUIRY"
    | "REQUEST_RESPONSE";

export default TypeRule;
