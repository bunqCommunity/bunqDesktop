import { connectGetBudget } from "~functions/ConnectGetPermissions";
import { filterShareInviteMonetaryAccountResponses } from "~functions/DataFilters";

export const calculateTotalBalance = (accounts, accountIds, shareInviteMonetaryAccountResponses = []) => {
    return accounts.reduce((accumulator, account) => {
        if (accountIds.includes(account.id)) {
            let accountBalance = account.getBalance();

            // get responses for this account
            const filteredResponses = shareInviteMonetaryAccountResponses.filter(
                filterShareInviteMonetaryAccountResponses(account.id)
            );

            // get budget from this response
            if (filteredResponses.length > 0) {
                const connectBudget = connectGetBudget(filteredResponses);
                if (connectBudget) {
                    // @ts-ignore
                    accountBalance = parseFloat(connectBudget);
                }
            }

            return accumulator + accountBalance;
        }
        return accumulator;
    }, 0);
};
