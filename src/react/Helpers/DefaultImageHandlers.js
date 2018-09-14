export const defaultPaymentImage = payment => {
    // if (payment.type === "IDEAL") {
    //     return "./images/svg/bunq-placeholders/placeholder_avatar_user_company.svg";
    // }

    return "./images/svg/bunq-placeholders/placeholder_avatar_user_person.svg";
};

export const defaultMastercardImage = masterCardAction => {
    let defaultImage =
        "./images/svg/bunq-placeholders/placeholder_avatar_card_e_commerce.svg";

    if (masterCardAction.label_card && masterCardAction.label_card.type) {
        switch (masterCardAction.label_card.type) {
            case "MAESTRO_MOBILE_NFC":
                // image for tap & pay and apple pay
                defaultImage =
                    "./images/svg/bunq-placeholders/placeholder_avatar_card_virtual.svg";
                break;
            default:
                // default card image
                defaultImage =
                    "./images/svg/bunq-placeholders/placeholder_avatar_cash_register.svg";
                break;
        }
    }

    return defaultImage;
};
