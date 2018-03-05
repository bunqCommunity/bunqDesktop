export default (type, newItems, oldItems) => {
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
        const newestId = newestItem[type].id;
        const oldestId = oldestItem[type].id;

        return {
            items: [...newItems],
            newer_id: newestId,
            older_id: oldestId
        };
    }

    // get the newer and older id from the list
    const { 0: newestItem, [oldItems.length - 1]: oldestItem } = oldItems;
    const newestId = newestItem[type].id;
    const oldestId = oldestItem[type].id;

    let prependItems = [];
    let appendItems = [];

    // check all new items
    newItems.map((newItem, newItemKey) => {
        const newItemInfo = newItem[type];
        let foundExistingItem = false;

        // loop through old items and update when possible
        oldItems.map((oldItem, oldItemKey) => {
            const oldItemInfo = oldItem[type];
            // id matches, overwrite old class
            if (newItemInfo.id === oldItemInfo.id) {
                oldItems[oldItemKey] = newItem;
                foundExistingItem = false;
            }
        });

        // only required if we haven't replaced an existing item yet
        if (foundExistingItem === false) {
            if (newestId < newItemInfo.id) {
                // item is newer and will be prepended
                prependItems.push(newItem);
            }
            if (oldestId > newItemInfo.id) {
                // item is older and will be appended
                appendItems.push(newItem);
            }
        }
    });

    // combine the newer items, older items and updated items in one list
    const mergedItems = [...prependItems, ...oldItems, ...appendItems];

    // get the newest and older id for the new combined list
    const {
        0: newestMergedItem,
        [mergedItems.length - 1]: oldestMergedItem
    } = mergedItems;

    const newesMergedtId = newestMergedItem[type].id;
    const oldestMergedId = oldestMergedItem[type].id;

    return {
        items: mergedItems,
        newer_id: newesMergedtId,
        older_id: oldestMergedId
    };
};
