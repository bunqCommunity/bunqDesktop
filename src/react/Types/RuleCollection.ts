import { Rule } from "./Rules/Rule";
import TransactionAmountRule from "./Rules/TransactionAmountRule";
import ValueRule from "./Rules/ValueRule";
import TypeRule from "./Rules/TypeRule";
import AccountRule from "./Rules/AccountRule";
import { generateGUID } from "../Functions/Utils";
import { RuleTypes, EventObject, EventTypes } from "./Types";

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

export default class RuleCollection {
    private id: string | null = null;
    private title: string = "";
    private matchType: RuleCollectionMatchType = "OR";
    private rules: Rule[] = [];
    private categories: string[] = [];
    private enabled: boolean;

    constructor(rules: Rule[] = [], categories: string[] = []) {
        this.rules = rules;
        this.categories = categories;
    }

    public setRules(rules: Rule[]): void {
        this.rules = rules;
    }
    public getRules(): Rule[] {
        return this.rules;
    }

    public setCategories(categories: string[]): void {
        this.categories = categories;
    }
    public getCategories(): string[] {
        return this.categories;
    }

    public setTitle(title: string): void {
        this.title = title;
    }
    public getTitle(): string {
        return this.title;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
    public isEnabled(): boolean {
        return this.enabled;
    }

    public setMatchType(matchType: "OR" | "AND"): void {
        this.matchType = matchType;
    }
    public getMatchType(): string {
        return this.matchType;
    }

    public setId(id: string): void {
        this.id = id;
    }
    public getId(): string {
        return this.id;
    }

    /**
     * Ensure a valid ID is set and generate a new one if not
     */
    public ensureId(): void {
        if (!this.id || this.id === null || this.id.length === 0) {
            this.generateId();
        }
    }

    /**
     * Generate a random ID for this collection
     */
    public generateId(): void {
        this.id = generateGUID();
    }

    /**
     * Goes through all events and returns the ones
     * @param {EventObject[]} events
     * @returns {EventObjectResult[]}
     */
    public filterItems(events: EventObject[]): EventObjectResult[] {
        const resultingEvents: EventObjectResult[] = [];
        const ruleCount = this.rules.length;

        events.forEach((event: EventObject) => {
            let matches = false;
            let matchingRules: EventObjectMatchingRule[] = [];

            if (ruleCount === 0) {
                // if rule count is 0 it automatically matches nothing
                matches = false;
            } else {
                const { ruleResult, matchedRules } = this.checkRules(event);
                matches = ruleResult;
                matchingRules = matchedRules;
            }

            // add this event to the resulting events list
            resultingEvents.push({
                item: event.item,
                type: event.type,
                matches: matches,
                matchingRules: matchingRules
            });
        });

        return resultingEvents;
    }

    /**
     * Checks if a single item matches all the currently set rules
     * @param {EventObject} event
     * @returns {boolean}
     */
    public checkRules(event: EventObject): RuleCollectionCheckRulesResult {
        const matchingRules: EventObjectMatchingRule[] = [];
        let checkRuleResult = false;

        if (this.matchType === "AND") {
            // all rules should match so we return using "every" which returns true of all are true
            checkRuleResult = this.rules.every((rule: Rule) => {
                const ruleResult = this.checkRule(rule, event);
                matchingRules.push({
                    rule: rule,
                    matched: ruleResult
                });
                return ruleResult;
            });
        } else {
            // only one has to match so we return using "some" which stops on the first match
            checkRuleResult = this.rules.some((rule: Rule) => {
                const ruleResult = this.checkRule(rule, event);
                matchingRules.push({
                    rule: rule,
                    matched: ruleResult
                });
                return ruleResult;
            });
        }

        return {
            ruleResult: checkRuleResult,
            matchedRules: matchingRules
        };
    }

    /**
     * Checks if a single item matches a single rule
     * @param {Rule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    public checkRule(rule: Rule, event: EventObject): boolean {
        // return an iterator function which has access to the event
        switch (rule.ruleType) {
            case "VALUE":
                return this.checkValueRule(rule, event);
            case "TRANSACTION_AMOUNT":
                return this.checkTransactionAmountRule(rule, event);
            case "ITEM_TYPE":
                return this.checkItemTypeRule(rule, event);
            case "ACCOUNT_TYPE":
                return this.checkAccountTypeRule(rule, event);
        }
        return false;
    }

    /**
     * Check if a field or custom field matches the given value
     * @param {ValueRule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    private checkValueRule(rule: ValueRule, event: EventObject): boolean {
        let dataToCheck = [];
        switch (rule.field) {
            case "DESCRIPTION":
                if (event.item.description) {
                    dataToCheck.push(event.item.description);
                }
                break;
            case "IBAN":
                switch (event.type) {
                    case "BunqMeTab":
                    case "MasterCardAction":
                        return false;

                    case "Payment":
                        // just check both
                        const ibanAlias = event.item.alias.iban;
                        const ibanCounterparty = event.item.alias.iban;

                        // don't push invalid/missing iban values
                        if (ibanAlias) dataToCheck.push(ibanAlias);
                        if (ibanCounterparty) dataToCheck.push(ibanCounterparty);
                        break;

                    case "RequestResponse":
                    case "RequestInquiry":
                        const iban = event.item.counterparty_alias.iban;
                        // return false if null
                        if (iban === null) return false;
                        dataToCheck.push(iban);
                        break;
                }

                dataToCheck = null;
                break;
            case "COUNTERPARTY_NAME":
                if (event.item.counterparty_alias) {
                    dataToCheck.push(event.item.counterparty_alias.display_name);
                }
                break;
            case "CUSTOM":
                // split the custom field on . character
                const customFieldParts = rule.customField.split(".");

                let tempObject = event.item;
                let failedToFind = false;
                for (let key in customFieldParts) {
                    const customFieldPart = customFieldParts[key];
                    // more field parts but the previous wasn't found
                    if (failedToFind === true) break;

                    if (tempObject[customFieldPart]) {
                        tempObject = tempObject[customFieldPart];
                    } else {
                        failedToFind = true;
                    }
                }

                // if we found the custom item, add it to the list
                if (failedToFind === false) {
                    dataToCheck.push(tempObject);
                }

                break;
            default:
                return false;
        }

        // no data found or null so we return true of the rule value is empty
        if (dataToCheck.length === 0) return rule.value && rule.value.length === 0;

        // go through every item
        let matchedItem = false;
        for (var index in dataToCheck) {
            const dataItem = dataToCheck[index];

            const valueToCheck = dataItem.toString().toLowerCase();
            const ruleValue = rule.value.toLowerCase();

            switch (rule.matchType) {
                case "REGEX":
                    // create a regexp so we can directly use the input value
                    const regex = new RegExp(rule.value, "igm");
                    // test the data with the regex pattern
                    matchedItem = regex.test(valueToCheck);
                    break;
                case "EXACT":
                    matchedItem = valueToCheck === ruleValue;
                    break;
                case "CONTAINS":
                    matchedItem = valueToCheck.includes(ruleValue);
                    break;
                case "ENDS_WITH":
                    matchedItem = valueToCheck.endsWith(ruleValue);
                    break;
                case "STARTS_WITH":
                    matchedItem = valueToCheck.startsWith(ruleValue);
                    break;
            }

            // break out since we found a match already
            if (matchedItem) break;
        }

        return matchedItem;
    }

    /**
     * Check if for the event type the given amount that was transacted is higher/lower than the rule amount
     * @param {TransactionAmountRule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    private checkTransactionAmountRule(rule: TransactionAmountRule, event: EventObject): boolean {
        let amount: number = 0;
        switch (event.type) {
            case "Payment":
                amount = parseFloat(event.item.amount.value);
                break;
            case "BunqMeTab":
                // no transaction amount for this so we ignore it
                return false;
            case "RequestInquiry":
                if (event.item.status === "ACCEPTED") {
                    // accepted so an amount was transferred
                    amount = parseFloat(event.item.amount_responded.value);
                } else {
                    // invalid type, just return false
                    return false;
                }
                break;
            case "RequestResponse":
                if (event.item.status === "ACCEPTED") {
                    // accepted so an amount was transferred
                    amount = parseFloat(event.item.amount_responded.value);
                } else {
                    // invalid type, just return false
                    return false;
                }
                break;
            case "MasterCardAction":
                amount = parseFloat(event.item.amount_billing.value);
                break;
        }

        // turn negative numbers into possitive numbers for outgoing payments
        amount = amount < 0 ? amount * -1 : amount;

        switch (rule.matchType) {
            case "MORE":
                return rule.amount < amount;
            case "MORE_EQUALS":
                return rule.amount <= amount;
            case "EXACTLY":
                return rule.amount === amount;
            case "LESS":
                return rule.amount > amount;
            case "LESS_EQUALS":
                return rule.amount >= amount;
        }
    }

    /**
     * @param {AccountRule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    private checkAccountTypeRule(rule: AccountRule, event: EventObject): boolean {
        if (event.item.monetary_account_id !== rule.accountId) {
            return false;
        }

        if (rule.paymentType === "ALL") {
            return true;
        }

        // let amount: number = 0;
        switch (event.type) {
            case "Payment":
                if (rule.paymentType === "SENDS") {
                    // send type and amount is negative
                    return event.item.amount.value < 0;
                } else if (rule.paymentType === "RECEIVES") {
                    // receive type and amount is positive
                    return event.item.amount.value > 0;
                }
                return false;
            case "MasterCardAction":
                if (rule.paymentType === "SENDS") {
                    return true;
                }
                return false;
            case "BunqMeTab":
            case "RequestInquiry":
            case "RequestResponse":
                return false;
        }
    }

    /**
     * Checks if the given matchType for the rule matches the event type
     * @param {Rule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    private checkItemTypeRule(rule: TypeRule, event: EventObject): boolean {
        // simply check if the event type matches the requried rule type
        switch (rule.matchType) {
            case "PAYMENT":
                return event.type === "Payment" || event.type === "MasterCardAction";
            case "PAYMENT_RECEIVED":
                // not a payment so false
                if (event.type !== "Payment") return false;

                return event.item.amount.value > 0;
            case "PAYMENT_SENT":
                // all mastercardactions are outgoing payments
                if (event.type === "MasterCardAction") return true;
                // not mastercard or payment so false
                if (event.type !== "Payment") return false;

                return event.item.amount.value < 0;
            case "REGULAR_PAYMENT":
                return event.type === "Payment";
            case "MASTERCARD_PAYMENT":
                return event.type === "MasterCardAction";
            case "REQUEST":
                return event.type === "RequestResponse" || event.type === "RequestInquiry";
            case "REQUEST_INQUIRY":
                return event.type === "RequestInquiry";
            case "REQUEST_RESPONSE":
                return event.type === "RequestResponse";
            case "BUNQ_ME_TAB":
                return event.type === "BunqMeTab";
        }
    }

    /**
     * Return JSON stringified versio nof this object
     * @returns {string}
     */
    public toString(): string {
        return JSON.stringify({
            id: this.getId(),
            rules: this.getRules(),
            title: this.getTitle(),
            enabled: this.isEnabled(),
            matchType: this.getMatchType(),
            categories: this.getCategories()
        });
    }

    /**
     * Turn JSON string into a valid RuleCollection
     * @param {string} jsonString
     * @returns {RuleCollection}
     */
    public fromJSON(jsonString: string): RuleCollection {
        const plainObject = JSON.parse(jsonString);
        return this.fromObject(plainObject);
    }

    /**
     * Turn a plain object into a valid RuleCollection
     * @param object
     * @returns {RuleCollection}
     */
    public fromObject(object: any): RuleCollection {
        this.setCategories(object.categories);
        this.setMatchType(object.matchType);
        this.setEnabled(object.enabled);
        this.setRules(object.rules);
        this.setTitle(object.title);
        this.setId(object.id);

        return this;
    }

    /**
     * Validate a plain ruleCollection object
     * @param ruleCollection
     * @returns {ValidationResult | true}
     */
    public static validateRuleCollection(ruleCollection: any): ValidationResult | true {
        // basic type checks
        if (typeof ruleCollection.categories !== "object")
            return {
                valid: false,
                message: "Invalid 'categories'"
            };
        if (typeof ruleCollection.matchType !== "string")
            return {
                valid: false,
                message: "Invalid 'matchType'"
            };
        if (typeof ruleCollection.enabled !== "boolean")
            return {
                valid: false,
                message: "Invalid 'enabled' value"
            };
        if (typeof ruleCollection.rules !== "object")
            return {
                valid: false,
                message: "Invalid 'rules'"
            };
        if (typeof ruleCollection.title !== "string")
            return {
                valid: false,
                message: "Invalid 'title'"
            };

        // validate categories and rules are arrays
        if (ruleCollection.categories instanceof Array === false)
            return {
                valid: false,
                message: "Invalid 'categories'"
            };
        if (ruleCollection.rules instanceof Array === false)
            return {
                valid: false,
                message: "Invalid 'rules'"
            };

        // validate that all given categories are strings
        const allCategoriesAreStrings = ruleCollection.categories.every(categoryId => typeof categoryId === "string");
        if (allCategoriesAreStrings === false)
            return {
                valid: false,
                message: "One or more given categories are invalid"
            };

        // validate that all given rules are valid rules
        const allRulesAreValid = ruleCollection.rules.every(rule => this.validateRule(rule) === true);
        if (allRulesAreValid === false)
            return {
                valid: false,
                message: "One or more given rules are invalid"
            };

        return true;
    }

    /**
     * Validate a plain rule object
     * @param rule
     * @returns {ValidationResult | true}
     */
    public static validateRule(rule: any): ValidationResult | true {
        if (typeof rule !== "object")
            return {
                valid: false,
                message: "Rule isn't a valid object"
            };
        if (typeof rule.ruleType !== "string")
            return {
                valid: false,
                message: "Rule contained invalid 'ruleType'"
            };

        return true;
    }
}
