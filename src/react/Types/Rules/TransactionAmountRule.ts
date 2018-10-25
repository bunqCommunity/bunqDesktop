export type TransactionAmountRule = {
    ruleType: "TRANSACTION_AMOUNT";
    matchType: TransactionAmountType;
    amount: number;
};

export type TransactionAmountType = "MORE" | "MORE_EQUALS" | "EXACTLY" | "LESS" | "LESS_EQUALS";

export default TransactionAmountRule;
