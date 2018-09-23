/**
 * Turn first character into uppercase
 * @param str
 * @returns {string}
 */
export const ucfirst = str => {
    str += "";
    let f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};

/**
 * returns a , or . depending on localized result
 */
export const { preferedThousandSeparator, preferedDecimalSeparator } = (() => {
    return {
        preferedThousandSeparator: (10000).toLocaleString().substring(2, 3),
        preferedDecimalSeparator: (1.1).toLocaleString().substring(1, 2)
    };
})();

/**
 * Parses strings as float and returns a correct localized format
 * @param value
 * @param stayNegative
 * @returns {string}
 */
export const formatMoney = (value, stayNegative = false) => {
    let parsedValue = parseFloat(value);
    parsedValue =
        parsedValue < 0 && stayNegative === false
            ? parsedValue * -1
            : parsedValue;

    const localeType = window.BUNQDESKTOP_LANGUAGE_SETTING || "nl";

    return parsedValue.toLocaleString(localeType, {
        currency: "EUR",
        style: "currency",
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * validates json input by checking for thrown error
 * @param input
 * @returns {boolean}
 */
export const validateJSON = input => {
    if (typeof input === "object") {
        return true;
    }
    try {
        JSON.parse(input);
    } catch (ex) {
        return false;
    }
    return true;
};

/**
 * Turns language key into pretty human-readable text
 * @param key
 * @returns {*}
 */
export const getPrettyLanguage = key => {
    switch (key) {
        case "en":
            return "English";
        case "nl":
            return "Nederlands";
        case "de":
            return "Deutsch";
        case "es":
            return "Español";
        case "it":
            return "Italiano";
    }
    return key;
};

/**
 * Turns date into a UTC timezone date
 * @param dateString
 * @returns {Date}
 */
export const getUTCDate = dateString => {
    const date = new Date(dateString);

    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
};

/**
 * transforms a date into a date object in current timezone
 * @param date
 * @returns {Date}
 * @constructor
 */
export const UTCDateToLocalDate = date => {
    const utcDate = new Date(date);

    // get the timezoneOffset
    const timezoneOffset = utcDate.getTimezoneOffset();

    // return a new date with the correct timezone offset
    return new Date(utcDate.setMinutes(utcDate.getMinutes() - timezoneOffset));
};

/**
 * human readable date using locales
 * @param date
 * @param displayHoursMins
 * @param localization
 * @returns {string}
 */
export const humanReadableDate = (
    date,
    displayHoursMins = true,
    localization = "nl"
) => {
    const currentDate = new Date();
    const createDate = UTCDateToLocalDate(date);

    const localeType = window.BUNQDESKTOP_LANGUAGE_SETTING || localization;

    const month = createDate.toLocaleString(localeType, { month: "long" });

    // hide hours:minutes:seconds if disabled
    const hoursMinutes = displayHoursMins
        ? createDate.toLocaleTimeString(localeType)
        : "";

    // different year, add it to the label
    if (currentDate.getFullYear() !== createDate.getFullYear()) {
        return `${createDate.getDate()} ${month}, ${createDate.getFullYear()} ${hoursMinutes}`;
    }
    // only date/month and time
    return `${createDate.getDate()} ${month} ${hoursMinutes}`;
};

/**
 * Adds space every fourth character for IBAN numbers
 * @param iban
 * @returns {string}
 */
export const formatIban = iban => {
    const ret = [];
    let len;

    for (let i = 0, len = iban.length; i < len; i += 4) {
        ret.push(iban.substr(i, 4));
    }

    return ret.join(" ");
};

/**
 * Used to create basic random identifiers
 * @returns {string}
 */
export const generateGUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
    );
};
