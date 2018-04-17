export default (newItems, oldItems) => {
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
        .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
        // map the ids list  back to objects
        .map(eventId => mergedItemsObject[eventId]);

    // get the newest and older id for the new combined list
    const {
        0: newestMergedItem,
        [mergedItemsArray.length - 1]: oldestMergedItem
    } = mergedItemsArray;

    const newesMergedtId = newestMergedItem.id;
    const oldestMergedId = oldestMergedItem.id;

    return {
        items: mergedItemsArray,
        newer_id: newesMergedtId,
        older_id: oldestMergedId
    };
};
