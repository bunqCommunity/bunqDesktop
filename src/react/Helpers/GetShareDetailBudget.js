export default shareInviteBankResponses => {
    // get first connect (should only be one)
    const shareInviteResponseFirst = shareInviteBankResponses.pop();

    // check if atleast one item was found
    if (shareInviteResponseFirst) {
        const shareInviteResponse = shareInviteResponseFirst.ShareInviteBankResponse;

        // check if share details are available
        if (shareInviteResponse.share_detail && shareInviteResponse.share_detail.ShareDetailPayment) {
            // get budget from share invite bank response
            const budgetInfo = shareInviteResponse.share_detail.ShareDetailPayment.budget;

            if (budgetInfo) {
                // get the available balance for this budget
                return parseFloat(budgetInfo.amount_available.value);
            }
        }
    }

    return false;
};
