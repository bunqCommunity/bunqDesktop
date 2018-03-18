export type ValueRule = {
    ruleType: "VALUE";
    field: ValueRuleField;
    matchType: ValueRuleMatchType;
    value: string;
};

export type ValueRuleField = "DESCRIPTION" | "IBAN" | "COUNTERPARTY_NAME";

export type ValueRuleMatchType = "REGEX" | "EXACT" | "CONTAINS";

export default ValueRule;
