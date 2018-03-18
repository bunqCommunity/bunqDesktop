import RuleCollection from "./RuleCollection";

export type Rule = ValueRule | TransactionAmountRule | TypeRule;

// an object filled with ruleCollections with the ruleCollectionId as a key
export type RuleCollectionList = {
    [key: string]: RuleCollection;
};

// all valid rule types
export type RuleTypes = "VALUE" | "TRANSACTION_AMOUNT" | "ITEM_TYPE";

// value based rule type
export type ValueRule = {
    ruleType: "VALUE";
    field: ValueRuleField;
    matchType: ValueRuleMatchType;
    value: string;
    // value: string | RegExp;
};
export type ValueRuleField = "DESCRIPTION" | "IBAN" | "COUNTERPARTY_NAME";
export type ValueRuleMatchType = "REGEX" | "EXACT" | "CONTAINS";

// transaction amount rule type
export type TransactionAmountRule = {
    ruleType: "TRANSACTION_AMOUNT";
    matchType: TransactionAmountType;
    amount: number;
};
export type TransactionAmountType =
    | "MORE"
    | "MORE_EQUALS"
    | "LESS"
    | "LESS_EQUALS";

// eventtype rule type
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
