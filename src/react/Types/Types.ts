import RuleCollection from "./RuleCollection";

// an object filled with ruleCollections with the ruleCollectionId as a key
export type RuleCollectionList = {
    [key: string]: RuleCollection;
};

// all valid rule types
export type RuleTypes = "VALUE" | "TRANSACTION_AMOUNT" | "ITEM_TYPE";
