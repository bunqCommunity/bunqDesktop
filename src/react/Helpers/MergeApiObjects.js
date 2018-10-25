export default (accountId, newItems, oldItems) => {
    // no old items so we simply return the new list and new/old ids
    if (oldItems.length <= 0) {
        if (newItems.length <= 0) {
            return {
                items: [],
                newer_id: false,
                older_id: false
            };
        }

        const { 0: newestItem, [newItems.length - 1]: oldestItem } = newItems;
        const newestId = newestItem.id;
        const oldestId = oldestItem.id;

        return {
            items: [...newItems],
            newer_id: newestId,
            older_id: oldestId
        };
    }

    const mergedItemsObject = {};

    // add old items first
    oldItems.forEach(oldItem => (mergedItemsObject[oldItem.id] = oldItem));
    // add and overwrite old items with new items
    newItems.forEach(newItem => (mergedItemsObject[newItem.id] = newItem));

    // turn back into an array
    const mergedItemsArray = Object.keys(mergedItemsObject)
        // sort by key which is also the item id
        .sort((a, b) => {
            const aItem = mergedItemsObject[a];
            const bItem = mergedItemsObject[b];

            if (aItem.id > bItem.id) {
                return -1;
            }
            if (aItem.id < bItem.id) {
                return 1;
            }
            return 0;
        })
        // map the ids list  back to objects
        .map(eventId => mergedItemsObject[eventId]);

    // filter the merge list on the account ID to extract the newer and older id for this monetary account
    const accountFilteredItems = mergedItemsArray.filter(mergedItem => mergedItem.monetary_account_id === accountId);

    // get the newest and older id for the new combined list
    const { 0: newestMergedItem, [accountFilteredItems.length - 1]: oldestMergedItem } = accountFilteredItems;

    const newesMergedtId = newestMergedItem ? newestMergedItem.id : false;
    const oldestMergedId = oldestMergedItem ? oldestMergedItem.id : false;

    return {
        items: mergedItemsArray,
        newer_id: newesMergedtId,
        older_id: oldestMergedId
    };
};
