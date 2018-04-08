import { humanReadableDate } from "./Utils";

export default (
    t,
    scheduleStartDate,
    scheduleEndDate,
    recurrenceSize,
    recurrenceUnit
) => {
    let scheduledPaymentPrimary;
    const scheduledPaymentSecondary = `${t("From")}: ${humanReadableDate(
        scheduleStartDate
    )} ${scheduleEndDate
        ? ` - ${t("Until")}: ${humanReadableDate(scheduleEndDate)}`
        : ""}`;

    const paymentDone = t("Payment will be done");
    const recurrenceMore = recurrenceSize > 1;

    switch (recurrenceUnit) {
        case "ONCE":
            scheduledPaymentPrimary = `${paymentDone} once`;
            break;
        case "HOURLY":
            scheduledPaymentPrimary = `${paymentDone} every ${recurrenceMore
                ? `${recurrenceSize} ${t("hours")}`
                : t("hour")}`;
            break;
        case "DAILY":
            scheduledPaymentPrimary = `${paymentDone} every ${recurrenceMore
                ? `${recurrenceSize} ${t("days")}`
                : t("day")}`;
            break;
        case "WEEKLY":
            scheduledPaymentPrimary = `${paymentDone} every ${recurrenceMore
                ? `${recurrenceSize} ${t("weeks")}`
                : t("week")}`;
            break;
        case "MONTHLY":
            scheduledPaymentPrimary = `${paymentDone} every ${recurrenceMore
                ? `${recurrenceSize} ${t("months")}`
                : t("month")}`;
            break;
        case "YEARLY":
            scheduledPaymentPrimary = `${paymentDone} every ${recurrenceMore
                ? `${recurrenceSize} ${t("years")}`
                : t("year")}`;
            break;
    }

    return {
        primary: scheduledPaymentPrimary,
        secondary: scheduledPaymentSecondary
    };
};
