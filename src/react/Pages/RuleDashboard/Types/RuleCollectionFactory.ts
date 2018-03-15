import RuleCollection from "./RuleCollection";

export default class RuleCollectionFactory {
    public importJson(jsonString: string): RuleCollection {
        const json = JSON.parse(jsonString);
        return new RuleCollection(json.filters, json.categories);
    }

    public exportRuleCollection(filterCollection: RuleCollection): string {
        return JSON.stringify({
            title: filterCollection.getTitle(),
            categories: filterCollection.getCategories(),
            filters: filterCollection.getRules()
        });
    }
}
