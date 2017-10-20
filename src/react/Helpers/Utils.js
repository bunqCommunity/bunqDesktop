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

	let localDate = new Date(date);
	
    return localDate;
};

// human readable date from date string or object (nl for dutch)
export const humanReadableDate = (date, localization = "en-us") => {
    const currentDate = new Date();
    if (typeof date === "string") {
        var localDate = UTCDateToLocalDate(date);
    }
    const month = localDate.toLocaleString(localization, { month: "long" });

    // default format
    let formatResult = `${localDate.getDate()} ${month} ${("0"+localDate.getHours()).slice(-2)}:${("0"+localDate.getMinutes()).slice(-2)}:${("0"+localDate.getSeconds()).slice(-2)}`;

    // different year, add it to the label
    if (currentDate.getFullYear() !== localDate.getFullYear()) {
        formatResult = `${localDate.getDate()} ${month}, ${localDate.getFullYear()} ${localDate.getHours()}:${localDate.getMinutes()}:${localDate.getSeconds()}`;
    }

    return formatResult;
};

export default {
    ucfirst: ucfirst,
    validateJSON: validateJSON,
    UTCDateToLocalDate: UTCDateToLocalDate,
    humanReadableDate: humanReadableDate
};
