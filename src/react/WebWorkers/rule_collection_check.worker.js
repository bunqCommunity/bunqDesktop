import RuleCollection from "../Types/RuleCollection";

onmessage = e => {
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(e.data.ruleCollection);

    console.log(e.data.events);

    // filter the results
    const result = ruleCollection.filterItems(
        e.data.events.map(event => {
            return {
                item: event.item[event.type],
                type: event.type
            };
        })
    );

    console.log(result.filter(i => i.matches).length);

    postMessage({
        result: result,
        ruleCollectionId: ruleCollection.getId()
    });
};
