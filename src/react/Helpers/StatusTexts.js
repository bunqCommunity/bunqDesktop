export const requestResponseText = requestResponse => {
    switch (requestResponse.status) {
        case "ACCEPTED":
            return "You paid the request";
        case "PENDING":
            return "Received a request";
        case "REJECTED":
            return "You denied the request";
        case "REVOKED":
            return "Request was cancelled";
    }
};

export const requestInquiryText = requestInquiry => {
    switch (requestInquiry.status) {
        case "ACCEPTED":
            return "Your request was accepted";
        case "PENDING":
            return "Request sent and pending";
        case "REJECTED":
            return "Your request was denied";
        case "REVOKED":
            return "You cancelled the request";
    }
};

export const paymentText = payment => {
    const label =
        payment.amount.value < 0
            ? "Sent payment with "
            : "Received payment with ";

    return `${label}${paymentTypeParser(payment.type)}`;
};

export const paymentTypeParser = paymentType => {
    switch (paymentType) {
        case "BUNQ":
            return "bunq";
        case "IDEAL":
            return "iDEAL";
    }
    return paymentType;
};
