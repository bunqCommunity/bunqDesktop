const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

export const isValidPhonenumber = (number, region = "NL") => {
    try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number, region);

        return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {}

    return false;
};

export const getInternationalFormat = (number, region = "NL") => {
    try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number, region);

        // format as international number
        const formattedPhone = phoneUtil.format(parsedNumber, PNF.INTERNATIONAL);

        // remove spaces and minus chars
        return formattedPhone.replace(/[\- ]/g, "");
    } catch (err) {}

    return false;
};
