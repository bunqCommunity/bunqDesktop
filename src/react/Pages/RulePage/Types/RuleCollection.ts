import { Rule } from "./Types";
import { generateGUID } from "../../../Helpers/Utils";

export type RuleCollectionMatchType = "OR" | "AND";

export default class RuleCollection {
    private id: string = null;
    private title: string = "";
    private matchType: RuleCollectionMatchType = "OR";
    private filters: Rule[] = [];
    private categories: string[] = [];

    constructor(filters: Rule[] = [], categories: string[] = []) {
        this.filters = filters;
        this.categories = categories;
    }

    public setRules(filters: Rule[]): void {
        this.filters = filters;
    }

    public getRules(): Rule[] {
        return this.filters;
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

    public generateId(): void {
        this.id = generateGUID();
    }

    public toString(): string {
        return JSON.stringify({
            id: this.getId(),
            title: this.getTitle(),
            match_type: this.getMatchType(),
            categories: this.getCategories(),
            rules: this.getRules()
        });
    }

    public fromString(jsonString: string): RuleCollection {
        const json = JSON.parse(jsonString);

        this.setCategories(json.categories);
        this.setMatchType(json.match_type);
        this.setRules(json.rules);
        this.setTitle(json.title);
        this.setId(json.id);

        return this;
    }
}
