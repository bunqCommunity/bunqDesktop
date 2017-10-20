// first character into uppercase
export const ucfirst = str => {
    str += "";
    let f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
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
    if (typeof date === "string") {
        date = new Date(date);
    }
    var newDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
};

// human readable date from date string or object (nl for dutch)
export const humanReadableDate = (date, localization = "en-us") => {
    const currentDate = new Date();
    if (typeof date === "string") {
        date = UTCDateToLocalDate(date);
    }
    const month = date.toLocaleString(localization, { month: "long" });

    // default format
    let result = `${date.getDay()} ${month}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    // different year, add it to the label
    if (currentDate.getFullYear() !== date.getFullYear()) {
        result = `${date.getDay()} ${month}, ${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    return result;
};

export default {
    ucfirst: ucfirst,
    validateJSON: validateJSON,
    UTCDateToLocalDate: UTCDateToLocalDate,
    humanReadableDate: humanReadableDate
};
