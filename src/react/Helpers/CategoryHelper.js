export default (
    categories,
    categoryConnections,
    // item type E.G. Payment or BunqMeTab
    type,
    // unique id for this item
    itemId,
    // if true a negative search is done which returns all categories which aren't connected to the item
    reverseChips = false
) => {
    const results = [];

    Object.keys(categories).map(categoryId => {
        const categoryInfo = categories[categoryId];
        let foundConnection = false;

        // check if this category has connections for the requested type
        if (
            categoryConnections[categoryId] &&
            categoryConnections[categoryId][type]
        ) {
            // check if these connections contain the given id
            if (categoryConnections[categoryId][type].includes(itemId)) {
                foundConnection = true;
            }
        }

        // if found and we're not doing a negative lookup add the category to the list
        if (
            (reverseChips === false && foundConnection === true) ||
            (reverseChips === true && foundConnection === false)
        ) {
            results.push(categoryInfo);
        }
    });

    return results;
};
