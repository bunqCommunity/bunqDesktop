export const defaultPaymentImage = payment => {
    if (payment.type === "IDEAL") {
        return "./images/svg/bunq-placeholders/ic_ideal.svg";
    }

    return "./images/svg/bunq-placeholders/user_person.svg";
};

export const defaultRequestResponseImage = request => {
    if (request.type === "IDEAL") {
        return "./images/svg/bunq-placeholders/ic_ideal.svg";
    }

    return "./images/svg/bunq-placeholders/user_person.svg";
};

export const defaultMastercardImage = masterCardAction => {
    let defaultImage = "./images/svg/bunq-placeholders/card_e_commerce.svg";

    const panEntryMode = masterCardAction.pan_entry_mode_user;

    switch (panEntryMode) {
        case "ATM":
            defaultImage = "./images/svg/bunq-placeholders/card_atm.png";
            break;
        case "ICC":
            defaultImage = "./images/svg/bunq-placeholders/card_virtual.svg";
            break;
        case "MAGNETIC_STRIPE":
            defaultImage = "./images/svg/bunq-placeholders/cash_register.svg";
            break;
        default:
        case "E_COMMERCE":
            defaultImage = "./images/svg/bunq-placeholders/card_e_commerce.svg";
            break;
    }

    return defaultImage;
};
