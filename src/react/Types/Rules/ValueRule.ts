export type ValueRule = {
    ruleType: "VALUE";
    field: ValueRuleField;
    customField?: string | null;
    matchType: ValueRuleMatchType;
    value: string;
};

export type ValueRuleField = "DESCRIPTION" | "IBAN" | "COUNTERPARTY_NAME" | "CUSTOM";

export type ValueRuleMatchType = "REGEX" | "EXACT" | "CONTAINS" | "ENDS_WITH" | "STARTS_WITH";

export default ValueRule;
