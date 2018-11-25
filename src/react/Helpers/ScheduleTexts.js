import { humanReadableDate } from "./Utils";

export default (t, scheduleStartDate, scheduleEndDate, recurrenceSize, recurrenceUnit) => {
    let scheduledPaymentPrimary;
    const scheduledPaymentSecondary = `${t("From")}: ${humanReadableDate(scheduleStartDate)} ${
        scheduleEndDate ? ` - ${t("Until")}: ${humanReadableDate(scheduleEndDate)}` : ""
    }`;

    const onceText = t("once");
    const everyText = t("every");
    const paymentDone = t("Payment will be done");
    const recurrenceMore = recurrenceSize > 1;

    switch (recurrenceUnit) {
        case "ONCE":
            scheduledPaymentPrimary = `${paymentDone} ${onceText}`;
            break;
        case "HOURLY":
            scheduledPaymentPrimary = `${paymentDone} ${everyText} ${
                recurrenceMore ? `${recurrenceSize} ${t("hours")}` : t("hour")
            }`;
            break;
        case "DAILY":
            scheduledPaymentPrimary = `${paymentDone} ${everyText} ${
                recurrenceMore ? `${recurrenceSize} ${t("days")}` : t("day")
            }`;
            break;
        case "WEEKLY":
            scheduledPaymentPrimary = `${paymentDone} ${everyText} ${
                recurrenceMore ? `${recurrenceSize} ${t("weeks")}` : t("week")
            }`;
            break;
        case "MONTHLY":
            scheduledPaymentPrimary = `${paymentDone} ${everyText} ${
                recurrenceMore ? `${recurrenceSize} ${t("months")}` : t("month")
            }`;
            break;
        case "YEARLY":
            scheduledPaymentPrimary = `${paymentDone} ${everyText} ${
                recurrenceMore ? `${recurrenceSize} ${t("years")}` : t("year")
            }`;
            break;
    }

    return {
        primary: scheduledPaymentPrimary,
        secondary: scheduledPaymentSecondary
    };
};
