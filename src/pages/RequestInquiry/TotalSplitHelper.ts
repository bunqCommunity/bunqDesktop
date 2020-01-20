export default (targets, splitAmounts) => {
    // get split from the personal account
    const accountSplit = typeof splitAmounts.account !== "undefined" ? splitAmounts.account : 1;

    // get the total split amount from all other targets
    const splitAmountsTotal = targets.reduce((accumulator, target) => {
        // check if this target already has a custom split amount
        if (typeof splitAmounts[target.value] !== "undefined") {
            // add the total amount
            return accumulator + splitAmounts[target.value];
        }
        return accumulator + 1;
    }, 0);

    return splitAmountsTotal + accountSplit;
};
