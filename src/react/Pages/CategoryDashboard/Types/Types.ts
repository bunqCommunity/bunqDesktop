export type Rule = ValueRule | TypeRule;

export type ValueRule = {
    id: string | null;
    ruleType: "VALUE";
    field: ValueRuleField;
    matchType: ValueRuleMatchType;
    value: string;
    // value: string | RegExp;
};
export type ValueRuleField = "DESCRIPTION" | "IBAN" | "COUNTERPARTY_NAME";
export type ValueRuleMatchType = "REGEX" | "EXACT" | "CONTAINS";

export type TypeRule = {
    id: string | null;
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
