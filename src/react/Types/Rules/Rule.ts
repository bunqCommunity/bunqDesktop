import TransactionAmountRule from "./TransactionAmountRule";
import TypeRule from "./TypeRule";
import ValueRule from "./ValueRule";
import AccountRule from "./AccountRule";

export type Rule = ValueRule | TransactionAmountRule | TypeRule | AccountRule;

export default Rule;
