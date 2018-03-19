import { Rule } from "./Rules/Rule";
import { generateGUID } from "../Helpers/Utils";

export type RuleCollectionMatchType = "OR" | "AND";

export type ValidationResult = {
    valid: boolean;
    message: string;
};

export type EventTypes =
    | "Payment"
    | "BunqMeTab"
    | "RequestInquiry"
    | "RequestResponse"
    | "MasterCardAction";
export type EventObject = {
    type: EventTypes;
    item: any;
};
export type EventObjectResult = {
    type: EventTypes;
    matches: boolean;
    item: any;
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
        if (this.id === null || this.id.length === 0) {
            this.generateId();
        }
    }

    /**
     * Generate a random ID for this collection
     */
    public generateId(): void {
        this.id = generateGUID();
    }

    // Goes through all events and returns the ones
    public filterItems(events: EventObject[]): EventObjectResult[] {
        const resultingEvents: EventObjectResult[] = [];
        const ruleCount = this.rules.length;

        events.forEach((event: EventObject) => {
            let matches = false;
            if (ruleCount === 0) {
                // if rule count is 0 it automatically matches
                matches = true;
            } else if (this.checkRules(event)) {
                matches = true;
            }

            // add this event to the resulting events list
            resultingEvents.push({
                type: event.type,
                matches: matches,
                item: event.item
            });
        });
        return resultingEvents;
    }

    // Checks if a single item matches all the currently set rules
    public checkRules(event: EventObject): boolean {
        if (this.matchType === "AND") {
            // all rules should match so we return using "every" which returns true of all are true
            return this.rules.every((rule: Rule) =>
                this.checkRule(rule, event)
            );
        }
        // only one has to match so we return using "some" which stops on the first match
        return this.rules.some((rule: Rule) => this.checkRule(rule, event));
    }

    // Checks if a single item matches a single rule
    public checkRule(rule: Rule, event: EventObject): boolean {
        // return an iterator function which has access to the event
        switch (rule.ruleType) {
            case "VALUE":
                return this.checkValueRule(rule, event);
            case "TRANSACTION_AMOUNT":
                return this.checkTransactionAmountRule(rule, event);
            case "ITEM_TYPE": {
                return this.checkItemTypeRule(rule, event);
            }
        }
        return false;
    }

    private checkValueRule(rule: Rule, event: EventObject): boolean {
        return false;
    }

    private checkTransactionAmountRule(
        rule: Rule,
        event: EventObject
    ): boolean {
        return false;
    }

    /**
     * Checks if the given matchType for the rule matches the event type
     * @param {Rule} rule
     * @param {EventObject} event
     * @returns {boolean}
     */
    private checkItemTypeRule(rule: Rule, event: EventObject): boolean {
        if (event.type === "Payment") {
            console.log(event.type, rule.matchType);
        }

        // simply check if the event type matches the requried rule type
        switch (rule.matchType) {
            case "PAYMENT":
                return (
                    event.type === "Payment" ||
                    event.type === "MasterCardAction"
                );
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
                return (
                    event.type === "RequestResponse" ||
                    event.type === "RequestInquiry"
                );
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
    public static validateRuleCollection(
        ruleCollection: any
    ): ValidationResult | true {
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
        const allCategoriesAreStrings = ruleCollection.categories.every(
            categoryId => typeof categoryId === "string"
        );
        if (allCategoriesAreStrings === false)
            return {
                valid: false,
                message: "One or more given categories are invalid"
            };

        // validate that all given rules are valid rules
        const allRulesAreValid = ruleCollection.rules.every(
            rule => this.validateRule(rule) === true
        );
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
