// first character into uppercase
export const ucfirst = str => {
    str += "";
    let f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
};

// returns a , or . depending on localized result
export const { preferedThousandSeparator, preferedDecimalSeparator } = (() => {
    return {
        preferedThousandSeparator: (10000).toLocaleString().substring(2, 3),
        preferedDecimalSeparator: (1.1).toLocaleString().substring(1, 2)
    };
})();

// parses strings as float and returns a correct localized format
export const formatMoney = (value, stayNegative = false) => {
    let parsedValue = parseFloat(value);
    parsedValue =
        parsedValue < 0 && stayNegative === false
            ? parsedValue * -1
            : parsedValue;

    return parsedValue.toLocaleString(undefined, {
        currency: "EUR",
        style: "currency",
        currencyDisplay: "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// validates json input
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

// transforms a date string into a date object in current timezone
export const UTCDateToLocalDate = date => {
    let utcDate = date;
    if (typeof date !== "object") {
        utcDate = new Date(date);
    }

    // get the timezoneOffset
    const timezoneOffset = utcDate.getTimezoneOffset();

    // return a new date with the correct timezone offset
    return new Date(utcDate.setMinutes(utcDate.getMinutes() - timezoneOffset));
};

// human readable date from date string or object (nl for dutch)
export const humanReadableDate = (
    date,
    displayHoursMins = true,
    localization = "en-us"
) => {
    let currentDate = new Date();
    let createDate = date;
    if (typeof date !== "object") {
        createDate = UTCDateToLocalDate(date);
    }

    const month = createDate.toLocaleString(localization, { month: "long" });

    // hide hours:minutes:seconds if disabled
    const hoursMinutes = displayHoursMins
        ? createDate.toLocaleTimeString()
        : "";

    // different year, add it to the label
    if (currentDate.getFullYear() !== createDate.getFullYear()) {
        return `${createDate.getDate()} ${month}, ${createDate.getFullYear()} ${hoursMinutes}`;
    }
    // only date/month and time
    return `${createDate.getDate()} ${month} ${hoursMinutes}`;
};

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

// get the week for a specific date
export const getWeek = date => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
};
