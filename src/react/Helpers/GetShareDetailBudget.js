import { formatMoney } from "./Utils";

export default shareInviteBankResponses => {
    // get first connect (should only be one)
    const shareInviteResponseFirst = shareInviteBankResponses.pop();
    const shareInviteResponse =
        shareInviteResponseFirst.ShareInviteBankResponse;

    // get budget from share invite bank response
    const budgetInfo =
        shareInviteResponse.share_detail.ShareDetailPayment.budget;

    // get the available balance for this budget
    return budgetInfo.amount_available.value;
};
