import RuleCollection from "./RuleCollection";

export default class RuleCollectionFactory {
    public importJson(jsonString: string): RuleCollection {
        const json = JSON.parse(jsonString);

        const ruleCollection: RuleCollection = new RuleCollection(
            json.filters,
            json.categories
        );
        ruleCollection.setMatchType(json.match_type);
        ruleCollection.setTitle(json.title);
        ruleCollection.setId(json.id);

        return ruleCollection;
    }

    public exportRuleCollection(filterCollection: RuleCollection): string {
        return JSON.stringify({
            title: filterCollection.getTitle(),
            match_type: filterCollection.getMatchType(),
            categories: filterCollection.getCategories(),
            filters: filterCollection.getRules()
        });
    }
}
