export const defaultPaymentImage = payment => {
    if (payment.type === "IDEAL") {
        // return "ideal logo";
    }

    return "./images/svg/bunq-placeholders/user_person.svg";
};

export const defaultMastercardImage = masterCardAction => {
    let defaultImage =
        "./images/svg/bunq-placeholders/card_e_commerce.svg";

    if (masterCardAction.pan_entry_mode_user === "ATM") {
        // return "atm image";
    }

    if (masterCardAction.label_card && masterCardAction.label_card.type) {
        switch (masterCardAction.label_card.type) {
            case "MAESTRO_MOBILE_NFC":
                // image for tap & pay and apple pay
                defaultImage =
                    "./images/svg/bunq-placeholders/card_virtual.svg";
                break;
            default:
                // default card image
                defaultImage =
                    "./images/svg/bunq-placeholders/cash_register.svg";
                break;
        }
    }

    return defaultImage;
};
