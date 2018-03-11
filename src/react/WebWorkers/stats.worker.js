import { getWeek } from "../Helpers/Utils";
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
            return `${date.getFullYear()}`;
        case "monthly":
            return `${date.getFullYear()}/${date.getMonth() + 1}`;
        case "weekly":
            return `${date.getFullYear()}/${getWeek(date)}`;
        case "daily":
        default:
            return `${date.getMonth() + 1}/${date.getDate()}`;
    }
};

const roundMoney = amount => {
    return Math.round(amount * 100) / 100;
};

const bunqMeTabMapper = (bunqMeTabs, bunqMeTabFilterSettings) => {
    const data = [];
    bunqMeTabs
        .filter(bunqMeTabsFilter(bunqMeTabFilterSettings))
        .map(bunqMeTab => {
            data.push({
                date: new Date(bunqMeTab.BunqMeTab.created),
                change: 0,
                type: "bunqMeTab"
            });
        });
    return data;
};

const requestInquiryMapper = (requestInquiries, requestFilterSettings) => {
    const data = [];
    requestInquiries
        .filter(requestInquiryFilter(requestFilterSettings))
        .map(requestInquiry => {
            data.push({
                date: new Date(requestInquiry.RequestInquiry.created),
                change: 0,
                type: "requestInquiry"
            });
        });
    return data;
};

const requestResponseMapper = (requestResponses, requestFilterSettings) => {
    const data = [];
    requestResponses
        .filter(requestResponseFilter(requestFilterSettings))
        .map(requestResponse => {
            data.push({
                date: new Date(requestResponse.RequestResponse.created),
                change: 0,
                type: "requestResponse"
            });
        });
    return data;
};

const paymentMapper = (payments, paymentFilterSettings) => {
    const data = [];
    payments.filter(paymentFilter(paymentFilterSettings)).map(payment => {
        const paymentInfo = payment.Payment;
        const change = parseFloat(paymentInfo.amount.value);

        data.push({
            date: new Date(paymentInfo.created),
            change: -change,
            type: "payment"
        });
    });
    return data;
};

const masterCardActionMapper = (masterCardActions, paymentFilterSettings) => {
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
                    date: new Date(masterCardInfo.created),
                    change: change,
                    type: "masterCardAction"
                });
            }
        });
    return data;
};

const getData = (events, accounts, selectedAccount, type = "daily") => {
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
    // individual count history
    let paymentCountHistory = [];
    let masterCardActionCountHistory = [];
    let requestInquiryCountHistory = [];
    let requestResponseCountHistory = [];
    let bunqMeTabCountHistory = [];
    let labelData = [];
    const dataCollection = {};

    switch (type) {
        case "yearly":
            for (let year = 0; year < 2; year++) {
                const myDate = new Date();
                myDate.setFullYear(myDate.getFullYear() - year);
                const label = labelFormat(myDate, type);

                dataCollection[label] = [];
            }
            break;
        case "monthly":
            for (let month = 0; month < 12; month++) {
                const myDate = new Date();
                myDate.setMonth(myDate.getMonth() - month);
                const label = labelFormat(myDate, type);

                dataCollection[label] = [];
            }
            break;
        case "weekly":
            for (let week = 0; week < 52; week++) {
                const dateOffset =
                    week <= 0 ? 0 : 24 * 60 * 60 * 1000 * 7 * week;
                const myDate = new Date();
                myDate.setTime(myDate.getTime() - dateOffset);
                const label = labelFormat(myDate, type);

                dataCollection[label] = [];
            }
            break;
        case "daily":
            for (let day = 0; day < 30; day++) {
                const dateOffset = day <= 0 ? 0 : 24 * 60 * 60 * 1000 * day;
                const myDate = new Date();
                myDate.setTime(myDate.getTime() - dateOffset);
                const label = labelFormat(myDate, type);

                dataCollection[label] = [];
            }
            break;
    }

    // combine the list
    events
        .sort((a, b) => {
            return b.date - a.date;
        })
        .forEach(item => {
            const label = labelFormat(item.date, type);
            if (dataCollection[label]) {
                dataCollection[label].push(item);
            }
        });

    // loop through all the days
    Object.keys(dataCollection).map(label => {
        const timescaleInfo = {
            masterCardAction: 0,
            requestResponse: 0,
            requestInquiry: 0,
            bunqMeTab: 0,
            payment: 0
        };
        let timescaleChange = 0;
        dataCollection[label].map(item => {
            // increment this type to keep track of the different types
            timescaleInfo[item.type]++;
            // calculate change
            timescaleChange = timescaleChange + item.change;
        });

        // update balance and push it to the list
        balanceHistoryData.push(roundMoney(currentBalance));
        // count the events for this timescale
        eventCountHistory.push(dataCollection[label].length);
        // update the individual counts
        masterCardActionCountHistory.push(timescaleInfo.masterCardAction);
        requestInquiryCountHistory.push(timescaleInfo.requestInquiry);
        requestResponseCountHistory.push(timescaleInfo.requestResponse);
        bunqMeTabCountHistory.push(timescaleInfo.bunqMeTab);
        paymentCountHistory.push(timescaleInfo.payment);

        // update the balance for the next timescale
        currentBalance = currentBalance + timescaleChange;

        // push the label here so we can ignore certain days if required
        labelData.push(label);
    });

    return {
        // x axis labels
        labels: labelData.reverse(),
        // account balance
        balanceHistoryData: balanceHistoryData.reverse(),
        // total event count
        eventCountHistory: eventCountHistory.reverse(),
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
        ...bunqMeTabMapper(e.data.bunqMeTabs, e.data.bunqMeTabFilterSettings),
        ...requestInquiryMapper(
            e.data.requestInquiries,
            e.data.requestFilterSettings
        ),
        ...requestResponseMapper(
            e.data.requestResponses,
            e.data.requestFilterSettings
        ),
        ...paymentMapper(e.data.payments, e.data.paymentFilterSettings),
        ...masterCardActionMapper(
            e.data.masterCardActions,
            e.data.paymentFilterSettings
        )
    ];

    const data = getData(
        events,
        e.data.accounts,
        e.data.selectedAccount,
        e.data.timescale
    );

    postMessage(data);
};
