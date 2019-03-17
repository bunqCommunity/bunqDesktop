import RuleCollection from "../Types/RuleCollection";
import Event from "../Models/Event";

onmessage = e => {
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(e.data.ruleCollection);

    // filter the results
    const result = ruleCollection.filterItems(e.data.events.map(event => new Event(event)));

    postMessage({
        result: result,
        ruleCollectionId: ruleCollection.getId()
    });
};
