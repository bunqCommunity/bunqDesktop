export default ({
    selectedAccountIds,
    selectedCategories,
    searchTerm,
    paymentType,
    bunqMeTabType,
    requestType,
    paymentVisibility,
    bunqMeTabVisibility,
    requestVisibility,
    amountFilterAmount
}) => {
    return (
        selectedAccountIds.length <= 0 &&
        selectedCategories.length <= 0 &&
        searchTerm.length <= 0 &&
        paymentType === "default" &&
        bunqMeTabType === "default" &&
        requestType === "default" &&
        paymentVisibility === true &&
        bunqMeTabVisibility === true &&
        requestVisibility === true &&
        amountFilterAmount === ""
    );
};
