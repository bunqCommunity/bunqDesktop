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
 * Checks is a variable is an array
 * @param a
 * @returns {boolean}
 */
export const isArray = a => {
    return !!a && a.constructor === Array;
};

/**
 * Checks is a variable is an object
 * @param a
 * @returns {boolean}
 */
export const isObject = a => {
    return !!a && a.constructor === Object;
};

// list of keys which should be anonymized
export const anonymizeKeys = [
    "card_authorisation_id_response",
    "public_nick_name",
    "display_name",
    "second_line",
    "description",
    "country",
    "api_key",
    "session_id",
    "uuid",
    "iban"
];
// list of special handlers, used to keep certain formatting or values
export const anonymizedHandlers = {
    value: val => {
        return parseFloat(val) < 0 ? "-1.00" : "1.00";
    },
    address_billing: val => {
        if (!val) return val;
        return {
            emptied: "address"
        };
    },
    address_shipping: val => {
        if (!val) return val;
        return {
            emptied: "address"
        };
    },
    radius: val => 1.1,
    latitude: val => 1.1,
    longitude: val => 1.1,
    altitude: val => 1.1
};
export const anonymizedHandlerKeys = Object.keys(anonymizedHandlers);

/**
 * Goes through object and removes possibly personal info
 * @param object
 * @returns {*}
 */
export const anonymizeObject = (object, key = false) => {
    // this could be an item itself
    if (key) {
        if (anonymizeKeys.includes(key)) {
            // just return the same string value
            return "Anonymized value";
        }
        if (anonymizedHandlerKeys.includes(key)) {
            // run the special function to handle this item
            return anonymizedHandlers[key](object);
        }
    }

    // check if this item is an object or an array
    if (isObject(object)) {
        let noRefObject = { ...object };
        // go through all keys
        Object.keys(noRefObject).forEach(objectKey => {
            const objectItem = noRefObject[objectKey];
            // anonymize this item and re-set it
            noRefObject[objectKey] = anonymizeObject(objectItem, objectKey);
        });

        return noRefObject;
    } else if (isArray(object)) {
        let noRefArray = [...object];
        // go through all keys
        noRefArray.forEach((objectItem, key) => {
            // anonymize this item and re-set it
            noRefArray[key] = anonymizeObject(objectItem);
        });

        return noRefArray;
    }

    return object;
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
    parsedValue = parsedValue < 0 && stayNegative === false ? parsedValue * -1 : parsedValue;

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
export const humanReadableDate = (date, displayHoursMins = true, localization = "nl") => {
    const currentDate = new Date();
    const createDate = UTCDateToLocalDate(date);

    const localeType = window.BUNQDESKTOP_LANGUAGE_SETTING || localization;

    const month = createDate.toLocaleString(localeType, { month: "long" });

    // hide hours:minutes:seconds if disabled
    const hoursMinutes = displayHoursMins ? createDate.toLocaleTimeString(localeType) : "";

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
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};
