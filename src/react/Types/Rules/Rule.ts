import TransactionAmountRule from "./TransactionAmountRule";
import TypeRule from "./TypeRule";
import ValueRule from "./ValueRule";

export type Rule = ValueRule | TransactionAmountRule | TypeRule;

export default Rule;
