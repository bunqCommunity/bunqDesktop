import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import ChartTitle from "./ChartTitle";
import EventCountPieChart from "./Chart/PieChart/EventCountPieChart";
import EventSplitTransactionPieChart from "./Chart/PieChart/EventSplitTransactionPieChart";
import EventSplitCountPieChart from "./Chart/PieChart/EventSplitCountPieChart";
import EventTransactionPieChart from "./Chart/PieChart/EventTransactionPieChart";
import CategoryCountPieChart from "./Chart/PieChart/CategoryCountPieChart";
import CategoryTransactionPieChart from "./Chart/PieChart/CategoryTransactionPieChart";

export default props => {
    const {
        t,
        theme,
        data,
        categoryTransactionTypeSelector,
        displayTransactionAmount,
        splitCardTypes,
        categoryTransactionType
    } = props;

    return (
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                    <Paper
                        style={{
                            padding: 12
                        }}
                    >
                        <ChartTitle t={t}>{displayTransactionAmount ? "Transaction amount" : "Event count"}</ChartTitle>

                        {displayTransactionAmount ? (
                            splitCardTypes ? (
                                <EventSplitTransactionPieChart
                                    theme={theme}
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
                                <EventTransactionPieChart
                                    theme={theme}
                                    payments={props.payments}
                                    requestInquiryTransactionHistory={data.requestInquiryTransactionHistory}
                                    requestResponseTransactionHistory={data.requestResponseTransactionHistory}
                                    bunqMeTabTransactionHistory={data.bunqMeTabTransactionHistory}
                                    paymentTransactionHistory={data.paymentTransactionHistory}
                                    masterCardActionTransactionHistory={data.masterCardActionTransactionHistory}
                                />
                            )
                        ) : splitCardTypes ? (
                            <EventSplitCountPieChart
                                theme={theme}
                                payments={props.payments}
                                requestInquiryHistory={data.requestInquiryHistory}
                                requestResponseHistory={data.requestResponseHistory}
                                bunqMeTabHistory={data.bunqMeTabHistory}
                                paymentHistory={data.paymentHistory}
                                masterCardPaymentCountHistory={data.masterCardPaymentCountHistory}
                                maestroPaymentCountHistory={data.maestroPaymentCountHistory}
                                tapAndPayPaymentCountHistory={data.tapAndPayPaymentCountHistory}
                                applePayPaymentCountHistory={data.applePayPaymentCountHistory}
                            />
                        ) : (
                            <EventCountPieChart
                                theme={theme}
                                payments={props.payments}
                                masterCardActions={props.masterCardActions}
                                requestInquiries={props.requestInquiries}
                                requestResponses={props.requestResponses}
                                bunqMeTabs={props.bunqMeTabs}
                            />
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper
                        style={{
                            padding: 12
                        }}
                    >
                        <ChartTitle t={t}>
                            {displayTransactionAmount ? `Category ${categoryTransactionType}` : "Category count"}
                        </ChartTitle>

                        {displayTransactionAmount ? (
                            <CategoryTransactionPieChart
                                theme={theme}
                                categories={props.categories}
                                categoryTransactionHistory={data.categoryTransactionHistory}
                                categoryTransactionType={categoryTransactionType}
                            />
                        ) : (
                            <CategoryCountPieChart
                                theme={theme}
                                categories={props.categories}
                                categoryCountHistory={data.categoryCountHistory}
                            />
                        )}
                        {categoryTransactionTypeSelector}
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
};
