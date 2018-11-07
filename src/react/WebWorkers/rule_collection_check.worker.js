import RuleCollection from "../Types/RuleCollection";

onmessage = e => {
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(e.data.ruleCollection);

    // filter the results
    const result = ruleCollection.filterItems(e.data.events);
    postMessage({
        result: result,
        ruleCollectionId: ruleCollection.getId()
    });
};
