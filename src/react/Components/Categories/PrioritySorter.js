export default categories => {
    return categories.sort((a, b) => {
        return b.priority - a.priority;
    });
};
