import RuleCollection from "../Types/RuleCollection";

onmessage = e => {
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(e.data.ruleCollection);

    // filter the results
    const result = ruleCollection.filterItems(
        e.data.events.map(event => {
            return {
                item: event.item[event.type],
                type: event.type
            };
        })
    );

    postMessage({
        result: result,
        ruleCollectionId: ruleCollection.getId()
    });
};
