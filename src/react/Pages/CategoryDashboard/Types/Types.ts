export type Filter = ValueFilter | TypeFilter;

export type ValueFilter = {
    filterType: "VALUE";
    field: ValueFilterField;
    matchType: ValueFilterMatchType;
    value: string;
    // value: string | RegExp;
};
export type ValueFilterField = "DESCRIPTION"| "IBAN" | "COUNTERPARTY_NAME";
export type ValueFilterMatchType = "REGEX" | "EXACT" | "CONTAINS";

export type TypeFilter = {
    filterType: "ITEM_TYPE";
    matchType: TypeFilterMatchType;
};
export type TypeFilterMatchType =
    | "PAYMENT"
    | "BUNQ_ME_TAB"
    | "PAYMENT"
    | "REGULAR_PAYMENT"
    | "MASTERCARD_PAYMENT"
    | "REQUEST"
    | "REQUEST_INQUIRY"
    | "REQUEST_RESPONSE";
