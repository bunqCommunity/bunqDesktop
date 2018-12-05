import { filterShareInviteBankResponses } from "./DataFilters";

const getInviteResponse = (shareInviteBankResponses, accountId) => {
    const filteredInviteResponses = shareInviteBankResponses.filter(filterShareInviteBankResponses(accountId));

    // no results means no checks required
    if (filteredInviteResponses.length === 0) return true;

    // get first item from the list
    const firstInviteResponse = filteredInviteResponses.pop();

    return firstInviteResponse.ShareInviteBankResponse;
};

export const getConnectPermissions = (shareInviteBankResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteBankResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return inviteResponse.share_detail.ShareDetailPayment;
    if (inviteResponse.share_detail.ShareDetailReadOnly) return inviteResponse.share_detail.ShareDetailReadOnly;
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return inviteResponse.share_detail.ShareDetailDraftPayment;

    return {};
};

export const getConnectType = (shareInviteBankResponses, accountId) => {
    const inviteResponse = getInviteResponse(shareInviteBankResponses, accountId);
    if (!inviteResponse || inviteResponse === true) return true;

    if (inviteResponse.share_detail.ShareDetailPayment) return "ShareDetailPayment";
    if (inviteResponse.share_detail.ShareDetailReadOnly) return "ShareDetailReadOnly";
    if (inviteResponse.share_detail.ShareDetailDraftPayment) return "ShareDetailDraftPayment";

    return true;
};
