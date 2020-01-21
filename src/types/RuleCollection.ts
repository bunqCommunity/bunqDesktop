import { Rule } from "./Rules/Rule";
import TransactionAmountRule from "./Rules/TransactionAmountRule";
import ValueRule from "./Rules/ValueRule";
import TypeRule from "./Rules/TypeRule";
import AccountRule from "./Rules/AccountRule";
import { generateGUID } from "~functions/Utils";
import { EventObject, EventTypes } from "~types/Types";

export type RuleCollectionMatchType = "OR" | "AND";

export type ValidationResult = {
    valid: boolean;
    message: string;
};

export type EventObjectMatchingRule = {
    rule: Rule;
    matched: boolean;
};
export type EventObjectResult = {
    item: any;
    type: EventTypes;
    matches: boolean;
    matchingRules: EventObjectMatchingRule[];
};
export type RuleCollectionCheckRulesResult = {
    ruleResult: boolean;
    matchedRules: EventObjectMatchingRule[];
};

// Serializable interface for Redux
export interface IRuleCollection {
    id: string | null;
    title: string;
    matchType: RuleCollectionMatchType;
    rules: Rule[];
    categories: string[];
    enabled: boolean;
}
