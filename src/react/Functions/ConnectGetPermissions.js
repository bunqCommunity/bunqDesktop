import { filterShareInviteBankResponses } from "./DataFilters";

const getInviteResponse = (shareInviteBankResponses, accountId) => {
    const filteredInviteResponses = shareInviteBankResponses.filter(filterShareInviteBankResponses(accountId));

    // no results means no checks required
    if (filteredInviteResponses.length === 0) return true;

    // get first item from the list
    const firstInviteResponse = filteredInviteResponses.pop();

    return firstInviteResponse.ShareInviteBankResponse;
};

export const connectGetPermissions = (shareInviteBankResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteBankResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return inviteResponse.share_detail.ShareDetailPayment;
    if (inviteResponse.share_detail.ShareDetailReadOnly) return inviteResponse.share_detail.ShareDetailReadOnly;
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return inviteResponse.share_detail.ShareDetailDraftPayment;

    return {};
};

export const connectGetType = (shareInviteBankResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteBankResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return "ShareDetailPayment";
    if (inviteResponse.share_detail.ShareDetailReadOnly) return "ShareDetailReadOnly";
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return "ShareDetailDraftPayment";

    return true;
};

export const connectGetBudget = (shareInviteBankResponses, accountId) => {
    let inviteResponse = null;
    if (accountId) {
        inviteResponse = getInviteResponse(shareInviteBankResponses, accountId);
    } else {
        inviteResponse = shareInviteBankResponses.pop();
        if (inviteResponse) inviteResponse = inviteResponse.ShareInviteBankResponse;
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
