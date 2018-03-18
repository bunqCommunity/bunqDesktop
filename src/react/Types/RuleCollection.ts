import { Rule } from "./Rules/Rule";
import { generateGUID } from "../Helpers/Utils";

export type RuleCollectionMatchType = "OR" | "AND";

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
    public ensureId(): void {
        if (this.id === null || this.id.length === 0) {
            this.id = generateGUID();
        }
    }
    public generateId(): void {
        this.id = generateGUID();
    }

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

    public fromJSON(jsonString: string): RuleCollection {
        const plainObject = JSON.parse(jsonString);
        return this.fromObject(plainObject);
    }

    public fromObject(object: any): RuleCollection {
        this.setCategories(object.categories);
        this.setMatchType(object.matchType);
        this.setEnabled(object.enabled);
        this.setRules(object.rules);
        this.setTitle(object.title);
        this.setId(object.id);

        return this;
    }

    public validateRuleCollection(ruleCollection: any): boolean {
        // basic type checks
        if (typeof ruleCollection.categories !== "object") return false;
        if (typeof ruleCollection.matchType !== "string") return false;
        if (typeof ruleCollection.enabled !== "boolean") return false;
        if (typeof ruleCollection.rules !== "object") return false;
        if (typeof ruleCollection.title !== "string") return false;
        if (ruleCollection.id === null || typeof ruleCollection.id !== "string")
            return false;

        // validate categories and rules are arrays
        if (ruleCollection.categories instanceof Array === false) return false;
        if (ruleCollection.rules instanceof Array === false) return false;

        // validate that all given categories are strings
        const allCategoriesAreStrings = ruleCollection.categories.every(
            categoryId => typeof categoryId === "string"
        );
        if (allCategoriesAreStrings === false) return false;

        // validate that all given rules are valid rules
        const allRulesAreValid = ruleCollection.rules.every(rule =>
            this.validateRule(rule)
        );
        if (allRulesAreValid === false) return false;

        return true;
    }
    public validateRule(rule: any): boolean {
        return true;
    }
}
