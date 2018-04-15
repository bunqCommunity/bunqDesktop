import RuleCollection from "../Types/RuleCollection";

onmessage = e => {
    const ruleCollection = new RuleCollection();
    ruleCollection.fromObject(e.data.ruleCollection);

    // merge all even types
    const events = [
        ...e.data.payments.map(item => {
            return {
                type: "Payment",
                item: item.Payment
            };
        }),
        ...e.data.bunqMeTabs.map(item => {
            return {
                type: "BunqMeTab",
                item: item.BunqMeTab
            };
        }),
        ...e.data.requestInquiries.map(item => {
            return {
                type: "RequestInquiry",
                item: item.RequestInquiry
            };
        }),
        ...e.data.requestResponses.map(item => {
            return {
                type: "RequestResponse",
                item: item.RequestResponse
            };
        }),
        ...e.data.masterCardActions.map(item => {
            return {
                type: "MasterCardAction",
                item: item.MasterCardAction
            };
        })
    ];

    // filter the results
    const result = ruleCollection.filterItems(events);
    postMessage({
        result: result,
        ruleCollectionId: ruleCollection.getId()
    });
};
