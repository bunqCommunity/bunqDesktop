import { filterShareInviteMonetaryAccountResponses } from "./DataFilters";

const getInviteResponse = (shareInviteMonetaryAccountResponses, accountId) => {
    const filteredInviteResponses = shareInviteMonetaryAccountResponses.filter(
        filterShareInviteMonetaryAccountResponses(accountId)
    );

    // no results means no checks required
    if (filteredInviteResponses.length === 0) return true;

    // get first item from the list
    const firstInviteResponse = filteredInviteResponses.pop();

    return firstInviteResponse.ShareInviteMonetaryAccountResponse;
};

export const connectGetPermissions = (shareInviteMonetaryAccountResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteMonetaryAccountResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return inviteResponse.share_detail.ShareDetailPayment;
    if (inviteResponse.share_detail.ShareDetailReadOnly) return inviteResponse.share_detail.ShareDetailReadOnly;
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return inviteResponse.share_detail.ShareDetailDraftPayment;

    return {};
};

export const connectGetType = (shareInviteMonetaryAccountResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteMonetaryAccountResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return "ShareDetailPayment";
    if (inviteResponse.share_detail.ShareDetailReadOnly) return "ShareDetailReadOnly";
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return "ShareDetailDraftPayment";

    return true;
};

export const connectGetBudget = (shareInviteMonetaryAccountResponses, accountId) => {
    let inviteResponse = null;
    if (accountId) {
        inviteResponse = getInviteResponse(shareInviteMonetaryAccountResponses, accountId);
    } else {
        inviteResponse = shareInviteMonetaryAccountResponses.pop();
        if (inviteResponse) inviteResponse = inviteResponse.ShareInviteMonetaryAccountResponse;
    }
    if (!inviteResponse || inviteResponse === true) return true;

    // check if share details are available
    if (inviteResponse.share_detail && inviteResponse.share_detail.ShareDetailPayment) {
        // get budget from share invite bank response
        const budgetInfo = inviteResponse.share_detail.ShareDetailPayment.budget;

        if (budgetInfo) {
            // get the available balance for this budget
            return parseFloat(budgetInfo.amount_available.value);
        }
    }
    return false;
};
