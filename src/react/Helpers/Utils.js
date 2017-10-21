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
		var utcDate = new Date(date);
    }

	var offset = utcDate.getTimezoneOffset();
	var localDate = new Date(utcDate.setMinutes(utcDate.getMinutes() - offset));
	
	return localDate;
};

// human readable date from date string or object (nl for dutch)
export const humanReadableDate = (date, localization = "en-us") => {
    const currentDate = new Date();
    if (typeof date === "string") {
        var createDate = UTCDateToLocalDate(date);
    }
    const month = createDate.toLocaleString(localization, { month: "long" });

    // default format
    let formatResult = `${createDate.getDate()} ${month} ${createDate.toLocaleTimeString()}`;

    // different year, add it to the label
    if (currentDate.getFullYear() !== createDate.getFullYear()) {
        formatResult = `${createDate.getDate()} ${month}, ${createDate.getFullYear()} ${createDate.toLocaleTimeString()}`;
    }

    return formatResult;
};

export const generateGUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

export default {
    ucfirst: ucfirst,
    validateJSON: validateJSON,
    UTCDateToLocalDate: UTCDateToLocalDate,
    humanReadableDate: humanReadableDate
};
