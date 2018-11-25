import { parsePhoneNumber } from "libphonenumber-js";

export const isValidPhonenumber = (number, region = "NL") => {
    try {
        const phoneNumber = parsePhoneNumber(number, region);
        return phoneNumber.isValid();
    } catch (error) {}
    return false;
};

export const getInternationalFormat = (number, region = "NL") => {
    try {
        const phoneNumber = parsePhoneNumber(number, region);
        const formattedPhone = phoneNumber.formatInternational();

        // remove spaces and minus chars
        return formattedPhone.replace(/[\- ]/g, "");
    } catch (err) {}
    return false;
};
