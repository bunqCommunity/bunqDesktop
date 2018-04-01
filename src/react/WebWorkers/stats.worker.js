import {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    subDays,
    subWeeks,
    subMonths,
    subYears,
    getISOWeek as getWeek,
    getDayOfYear,
    format as DateFNSformat
} from "date-fns";
import CategoryHelper from "../Helpers/CategoryHelper";

import {
    bunqMeTabsFilter,
    masterCardActionFilter,
    paymentFilter,
    requestInquiryFilter,
    requestResponseFilter
} from "../Helpers/DataFilters";

const labelFormat = (date, type = "daily") => {
    switch (type) {
        case "yearly":
            return DateFNSformat(date, "_YYYY");
        case "monthly":
            return DateFNSformat(date, "MMM YYYY");
        case "weekly":
            return DateFNSformat(date, "WW/YYYY");
        case "daily":
        default:
            return DateFNSformat(date, "D MMM");
    }
};

const roundMoney = amount => {
    return Math.round(amount * 100) / 100;
};

const bunqMeTabMapper = (
    bunqMeTabs,
    bunqMeTabFilterSettings,
    categories,
    categoryConnections
) => {
    const data = [];
    bunqMeTabs
        .filter(bunqMeTabsFilter(bunqMeTabFilterSettings))
        .map(bunqMeTab => {
            data.push({
                date: new Date(bunqMeTab.BunqMeTab.created),
                change: 0,
                type: "bunqMeTab",
                // categories: []
                categories: CategoryHelper(
                    categories,
                    categoryConnections,
                    "BunqMeTab",
                    bunqMeTab.BunqMeTab.id
                )
            });
        });
    return data;
};

const requestInquiryMapper = (
    requestInquiries,
    requestFilterSettings,
    categories,
    categoryConnections
) => {
    const data = [];
    requestInquiries
        .filter(requestInquiryFilter(requestFilterSettings))
        .map(requestInquiry => {
            data.push({
                date: new Date(requestInquiry.RequestInquiry.created),
                change: 0,
                type: "requestInquiry",
                // categories: []
                categories: CategoryHelper(
                    categories,
                    categoryConnections,
                    "RequestInquiry",
                    requestInquiry.RequestInquiry.id
                )
            });
        });
    return data;
};

const requestResponseMapper = (
    requestResponses,
    requestFilterSettings,
    categories,
    categoryConnections
) => {
    const data = [];
    requestResponses
        .filter(requestResponseFilter(requestFilterSettings))
        .map(requestResponse => {
            data.push({
                date: new Date(requestResponse.RequestResponse.created),
                change: 0,
                type: "requestResponse",
                // categories: []
                categories: CategoryHelper(
                    categories,
                    categoryConnections,
                    "RequestResponse",
                    requestResponse.RequestResponse.id
                )
            });
        });
    return data;
};

const paymentMapper = (
    payments,
    paymentFilterSettings,
    categories,
    categoryConnections
) => {
    const data = [];
    payments.filter(paymentFilter(paymentFilterSettings)).map(payment => {
        const paymentInfo = payment.Payment;
        const change = parseFloat(paymentInfo.amount.value);

        data.push({
            date: new Date(paymentInfo.created),
            change: -change,
            type: "payment",
            // categories: []
            categories: CategoryHelper(
                categories,
                categoryConnections,
                "Payment",
                paymentInfo.id
            )
        });
    });
    return data;
};

const masterCardActionMapper = (
    masterCardActions,
    paymentFilterSettings,
    categories,
    categoryConnections
) => {
    const data = [];
    masterCardActions
        .filter(masterCardActionFilter(paymentFilterSettings))
        .map(masterCardAction => {
            const masterCardInfo = masterCardAction.MasterCardAction;
            const change = parseFloat(masterCardInfo.amount_billing.value);

            const validTypes = [
                "CLEARING_REFUND",
                "PRE_AUTHORISED",
                "PRE_AUTHORISATION_FINALISED",
                "ACQUIRER_AUTHORISED",
                "AUTHORISED",
                "AUTHORISED_PARTIAL",
                "STAND_IN_AUTHORISED",
                "UNAUTHORISED_CLEARING"
            ];

            if (validTypes.includes(masterCardInfo.authorisation_status)) {
                data.push({
                    date: new Date(masterCardInfo.updated),
                    change: change,
                    type: "masterCardAction",
                    // categories: []
                    categories: CategoryHelper(
                        categories,
                        categoryConnections,
                        "MasterCardAction",
                        masterCardInfo.id
                    )
                });
            }
        });
    return data;
};

const formatLabels = (events, type) => {
    const dataCollection = {};

    // nothing to do with no events
    if (events.length <= 0) return dataCollection;

    // get newest item to check its date
    switch (type) {
        case "yearly":
            const startDateYearly = new Date();
            const endDateYearly = events[events.length - 1].date;
            const yearDifference1 =
                startDateYearly.getFullYear() - endDateYearly.getFullYear() + 1;

            for (let year = 0; year < yearDifference1; year++) {
                const startDate = subYears(new Date(), year);

                const label = labelFormat(startDate, type);
                dataCollection[label] = {
                    data: [],
                    date: startDate
                };
            }
            break;

        case "monthly":
            const startDateMonthly = new Date();
            const endDateMonthly = events[events.length - 1].date;
            const yearDifference2 =
                startDateMonthly.getFullYear() - endDateMonthly.getFullYear();

            // calculate difference in months between the two dates
            let monthDifference =
                startDateMonthly.getMonth() -
                endDateMonthly.getMonth() +
                1 +
                yearDifference2 * 12;

            // limit to 24 months
            monthDifference = monthDifference > 24 ? 24 : monthDifference;

            for (let month = 0; month < monthDifference; month++) {
                const startDate = subMonths(new Date(), month);

                const label = labelFormat(startDate, type);
                dataCollection[label] = {
                    data: [],
                    date: startDate
                };
            }
            break;

        case "weekly":
            const startDateWeekly = new Date();
            const endDateWeekly = events[events.length - 1].date;
            const yearDifference3 =
                startDateWeekly.getFullYear() - endDateWeekly.getFullYear();

            // calculate difference in weeks between the two dates
            let weekDifference =
                getWeek(startDateWeekly) -
                getWeek(endDateWeekly) +
                1 +
                yearDifference3 * 53;

            // limit to 53 weeks
            weekDifference = weekDifference > 53 ? 53 : weekDifference;

            for (let week = 0; week < weekDifference; week++) {
                const startDate = subWeeks(new Date(), week);

                const label = labelFormat(startDate, type);
                dataCollection[label] = {
                    data: [],
                    date: startDate
                };
            }
            break;

        case "daily":
            const startDateDayly = new Date();
            const endDateDayly = events[events.length - 1].date;
            const yearDifference4 =
                startDateDayly.getFullYear() - endDateDayly.getFullYear();

            // calculate the difference in days between the two dates
            let dayDifference =
                getDayOfYear(startDateDayly) -
                getDayOfYear(endDateDayly) +
                yearDifference4 * 365;

            // limit to 60 days
            dayDifference = dayDifference > 60 ? 60 : dayDifference;

            for (let day = 0; day < dayDifference; day++) {
                const startDate = subDays(new Date(), day);

                const label = labelFormat(startDate, type);
                dataCollection[label] = {
                    data: [],
                    date: startDate
                };
            }
            break;
    }
    return dataCollection;
};

const getData = (
    events,
    accounts,
    categories,
    selectedAccount,
    timeFrom = null,
    timeTo = new Date(),
    type = "daily"
) => {
    let accountInfo = false;
    accounts.map(account => {
        if (
            account.MonetaryAccountBank.id === selectedAccount ||
            selectedAccount === false
        ) {
            accountInfo = account.MonetaryAccountBank;
        }
    });
    let currentBalance = parseFloat(accountInfo.balance.value);

    // balance across all days/weeks/months/years
    let balanceHistoryData = [];
    // total events history
    let eventCountHistory = [];
    // total category history
    let categoryCountHistory = {};
    // individual count history
    let paymentCountHistory = [];
    let masterCardActionCountHistory = [];
    let requestInquiryCountHistory = [];
    let requestResponseCountHistory = [];
    let bunqMeTabCountHistory = [];
    let labelData = [];

    // sort all events by date first
    const sortedEvents = events.sort((a, b) => {
        return b.date - a.date;
    });

    // create the correct labels for the X axis
    const dataCollection = formatLabels(events, type);

    // combine the list
    sortedEvents.forEach(item => {
        const label = labelFormat(item.date, type);
        if (dataCollection[label]) {
            dataCollection[label].data.push(item);
        }
    });

    // only create this object once
    const categoryList = {};
    Object.keys(categories).forEach(categoryKey => {
        categoryList[categoryKey] = 0;
        categoryCountHistory[categoryKey] = [];
    });

    // loop through all the days
    Object.keys(dataCollection).map(label => {
        const dataItem = dataCollection[label];
        const categoryInfo = Object.assign({}, categoryList);

        const timescaleData = dataItem.data;
        const timescaleDate = dataItem.date;

        const timescaleInfo = {
            masterCardAction: 0,
            requestResponse: 0,
            requestInquiry: 0,
            bunqMeTab: 0,
            payment: 0
        };

        let timescaleChange = 0;
        timescaleData.map(item => {
            // increment this type to keep track of the different types
            timescaleInfo[item.type]++;

            // increment the category count for this timescale
            item.categories.forEach(category => categoryInfo[category.id]++);

            // calculate change
            timescaleChange = timescaleChange + item.change;
        });

        // fix the date ranges
        let timeToFixed = timeTo;
        let timeFromFixed = timeFrom;
        switch (type) {
            case "yearly":
                timeToFixed = timeTo === null ? null : addYears(timeTo, 1);
                timeFromFixed =
                    timeFrom === null ? null : subYears(timeFrom, 1);
                break;
            case "monthly":
                timeToFixed = timeTo === null ? null : addMonths(timeTo, 1);
                timeFromFixed =
                    timeFrom === null ? null : subMonths(timeFrom, 1);
                break;
            case "weekly":
                timeToFixed = timeTo === null ? null : addWeeks(timeTo, 1);
                timeFromFixed =
                    timeFrom === null ? null : subWeeks(timeFrom, 1);
                break;
            case "daily":
                timeToFixed = timeTo === null ? null : addDays(timeTo, 1);
                timeFromFixed = timeFrom === null ? null : subDays(timeFrom, 1);
                break;
        }

        if (
            timeToFixed === null ||
            timescaleDate.getTime() <= timeToFixed.getTime()
        ) {
            if (
                timeFromFixed === null ||
                timescaleDate.getTime() >= timeFromFixed.getTime()
            ) {
                // only push this data and label if they are within the range

                // update the category counts for each category
                Object.keys(categoryInfo).forEach(categoryKey => {
                    categoryCountHistory[categoryKey].push(
                        categoryInfo[categoryKey]
                    );
                });

                // update balance and push it to the list
                balanceHistoryData.push(roundMoney(currentBalance));
                // count the events for this timescale
                eventCountHistory.push(timescaleData.length);
                // update the individual counts
                masterCardActionCountHistory.push(
                    timescaleInfo.masterCardAction
                );
                requestInquiryCountHistory.push(timescaleInfo.requestInquiry);
                requestResponseCountHistory.push(timescaleInfo.requestResponse);
                bunqMeTabCountHistory.push(timescaleInfo.bunqMeTab);
                paymentCountHistory.push(timescaleInfo.payment);

                // push the label here so we can ignore certain days if required
                labelData.push(label);
            }
        }

        // always update the balance for the next timescale
        currentBalance = currentBalance + timescaleChange;
    });

    // update the category counts for each category
    Object.keys(categoryCountHistory).forEach(categoryKey => {
        categoryCountHistory[categoryKey] = categoryCountHistory[
            categoryKey
        ].reverse();
    });

    return {
        // x axis labels
        labels: labelData.reverse(),
        // account balance
        balanceHistoryData: balanceHistoryData.reverse(),
        // total event count
        eventCountHistory: eventCountHistory.reverse(),
        // total category count
        categoryCountHistory: categoryCountHistory,
        // individual history count
        masterCardActionHistory: masterCardActionCountHistory.reverse(),
        requestResponseHistory: requestResponseCountHistory.reverse(),
        requestInquiryHistory: requestInquiryCountHistory.reverse(),
        bunqMeTabHistory: bunqMeTabCountHistory.reverse(),
        paymentHistory: paymentCountHistory.reverse()
    };
};

onmessage = e => {
    const events = [
        ...bunqMeTabMapper(
            e.data.bunqMeTabs,
            e.data.bunqMeTabFilterSettings,
            e.data.categories,
            e.data.categoryConnections
        ),
        ...requestInquiryMapper(
            e.data.requestInquiries,
            e.data.requestFilterSettings,
            e.data.categories,
            e.data.categoryConnections
        ),
        ...requestResponseMapper(
            e.data.requestResponses,
            e.data.requestFilterSettings,
            e.data.categories,
            e.data.categoryConnections
        ),
        ...paymentMapper(
            e.data.payments,
            e.data.paymentFilterSettings,
            e.data.categories,
            e.data.categoryConnections
        ),
        ...masterCardActionMapper(
            e.data.masterCardActions,
            e.data.paymentFilterSettings,
            e.data.categories,
            e.data.categoryConnections
        )
    ];

    const data = getData(
        events,
        // account data
        e.data.accounts,
        // full list of categories
        e.data.categories,
        // selected account
        e.data.selectedAccount,
        // date from range
        e.data.timeFrom,
        // date to
        e.data.timeTo,
        // display charts with daily/weekly/monthyl/yearly increments
        e.data.timescale
    );

    postMessage(data);
};
