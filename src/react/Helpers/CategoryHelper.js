export default (categories, categoryConnections, type, itemId) => {
    const results = [];

    Object.keys(categories).map(categoryId => {
        const categoryInfo = categories[categoryId];

        // check if this category has connections for the requested type
        if (
            categoryConnections[categoryId] &&
            categoryConnections[categoryId][type]
        ) {
            // check if these connections contain the given id
            if (categoryConnections[categoryId][type].includes(itemId)) {
                results.push(categoryInfo);
            }
        }
    });

    return results;
};
