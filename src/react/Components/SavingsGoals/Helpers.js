import { connectGetBudget } from "../../Functions/ConnectGetPermissions";
import { filterShareInviteMonetaryAccountResponses } from "../../Functions/DataFilters";
import { formatMoney } from "../../Functions/Utils";

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
                    accountBalance = parseFloat(connectBudget);
                }
            }

            return accumulator + accountBalance;
        }
        return accumulator;
    }, 0);
};
