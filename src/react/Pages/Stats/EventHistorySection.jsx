import React from "react";
import Paper from "@material-ui/core/Paper";

import ChartTitle from "./ChartTitle";
import EventTypeTransactionHistoryChart from "./Chart/Timeline/EventTypeTransactionHistoryChart";
import EventTypeSplitTransactionHistoryChart from "./Chart/Timeline/EventTypeSplitTransactionHistoryChart";
import EventTypeHistoryChart from "./Chart/Timeline/EventTypeHistoryChart";
import EventTypeSplitHistoryChart from "./Chart/Timeline/EventTypeSplitHistoryChart";

export default props => {
    const { t, theme, data, displayTransactionAmount, splitCardTypes } = props;

    return (
        <Paper>
            <ChartTitle t={t}>
                {displayTransactionAmount ? "Event transaction history" : "Event history count"}
            </ChartTitle>

            {splitCardTypes ? (
                displayTransactionAmount ? (
                    <EventTypeSplitTransactionHistoryChart
                        height={500}
                        theme={theme}
                        labels={data.labels}
                        requestInquiryTransactionHistory={data.requestInquiryTransactionHistory}
                        requestResponseTransactionHistory={data.requestResponseTransactionHistory}
                        bunqMeTabTransactionHistory={data.bunqMeTabTransactionHistory}
                        paymentTransactionHistory={data.paymentTransactionHistory}
                        masterCardPaymentTransactionHistory={data.masterCardPaymentTransactionHistory}
                        maestroPaymentTransactionHistory={data.maestroPaymentTransactionHistory}
                        tapAndPayPaymentTransactionHistory={data.tapAndPayPaymentTransactionHistory}
                        applePayPaymentTransactionHistory={data.applePayPaymentTransactionHistory}
                    />
                ) : (
                    <EventTypeSplitHistoryChart
                        height={500}
                        theme={theme}
                        labels={data.labels}
                        requestInquiryHistory={data.requestInquiryHistory}
                        requestResponseHistory={data.requestResponseHistory}
                        bunqMeTabHistory={data.bunqMeTabHistory}
                        paymentHistory={data.paymentHistory}
                        masterCardPaymentCountHistory={data.masterCardPaymentCountHistory}
                        maestroPaymentCountHistory={data.maestroPaymentCountHistory}
                        tapAndPayPaymentCountHistory={data.tapAndPayPaymentCountHistory}
                        applePayPaymentCountHistory={data.applePayPaymentCountHistory}
                    />
                )
            ) : displayTransactionAmount ? (
                <EventTypeTransactionHistoryChart
                    height={500}
                    theme={theme}
                    labels={data.labels}
                    requestInquiryTransactionHistory={data.requestInquiryTransactionHistory}
                    requestResponseTransactionHistory={data.requestResponseTransactionHistory}
                    bunqMeTabTransactionHistory={data.bunqMeTabTransactionHistory}
                    paymentTransactionHistory={data.paymentTransactionHistory}
                    masterCardActionTransactionHistory={data.masterCardActionTransactionHistory}
                />
            ) : (
                <EventTypeHistoryChart
                    height={500}
                    theme={theme}
                    labels={data.labels}
                    requestInquiryHistory={data.requestInquiryHistory}
                    requestResponseHistory={data.requestResponseHistory}
                    bunqMeTabHistory={data.bunqMeTabHistory}
                    paymentHistory={data.paymentHistory}
                    masterCardActionHistory={data.masterCardActionHistory}
                />
            )}
        </Paper>
    );
};
