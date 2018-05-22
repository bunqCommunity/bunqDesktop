export const filterShareInviteBankResponses = accountId => shareInviteBankResponse => {
    if (!shareInviteBankResponse.ShareInviteBankResponse) return false;

    return (
        shareInviteBankResponse.ShareInviteBankResponse.status === "ACCEPTED" &&
        shareInviteBankResponse.ShareInviteBankResponse.monetary_account_id ===
            accountId
    );
};

export const filterShareInviteBankInquiries = accountId => shareInviteBankInquiry => {
    if (!shareInviteBankInquiry.ShareInviteBankInquiry) return false;

    return (
        shareInviteBankInquiry.ShareInviteBankInquiry.status === "ACCEPTED" &&
        shareInviteBankInquiry.ShareInviteBankInquiry.monetary_account_id ===
            accountId
    );
};
