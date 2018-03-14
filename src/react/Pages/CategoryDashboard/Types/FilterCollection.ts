import { Filter } from "./Types";

export default class FilterCollection {
    private matchType: "OR" | "AND" = "OR";
    private title: string = "";
    private filters: Filter[] = [];
    private categories: string[] = [];

    constructor(filters: Filter[] = [], categories: string[] = []) {
        this.filters = filters;
        this.categories = categories;
    }

    public setFilters(filters: Filter[]): void {
        this.filters = filters;
    }

    public getFilters(): Filter[] {
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
}
