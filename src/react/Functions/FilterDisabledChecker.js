const FilterDisabledChecker = ({
    dateFromFilter = null,
    dateToFilter = null,
    selectedCategories = [],
    selectedAccountIds = [],
    selectedCardIds = [],
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
        dateFromFilter === null &&
        dateToFilter === null &&
        selectedCategories.length <= 0 &&
        selectedAccountIds.length <= 0 &&
        selectedCardIds.length <= 0 &&
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

export default FilterDisabledChecker;
