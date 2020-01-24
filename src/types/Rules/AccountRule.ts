export type AccountRule = {
    ruleType: "ACCOUNT_TYPE";
    accountId: number | null;
    paymentType: TypePaymentType;
};

export type TypePaymentType = "RECEIVES" | "SENDS" | "ALL";

export default AccountRule;
