export const calculateTotalBalance = (accounts, accountIds) => {
    return accounts.reduce((accumulator, account) => {
        if (accountIds.includes(account.id)) {
            return accumulator + account.getBalance();
        }
        return accumulator;
    }, 0);
};
