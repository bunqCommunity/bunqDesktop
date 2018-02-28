import React from "react";
import { Bar } from "react-chartjs-2";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import InboxIcon from "material-ui-icons/Inbox";

import LoadOlderButton from "../Components/LoadOlderButton";

import { masterCardActionFilter, paymentFilter } from "../Helpers/DataFilters";

class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    paymentMapper = () => {
        const data = [];
        this.props.payments
            .filter(
                paymentFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
            .map(payment => {
                const paymentInfo = payment.Payment;
                const change = parseFloat(paymentInfo.amount.value);

                data.push({
                    date: new Date(paymentInfo.created),
                    change: -change,
                    amount: paymentInfo.amount.value
                });
            });
        return data;
    };

    masterCardActionMapper = () => {
        const data = [];
        this.props.masterCardActions
            .filter(
                masterCardActionFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
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
                        amount: masterCardInfo.amount_billing.value
                    });
                }
            });
        return data;
    };

    roundMoney = amount => {
        return Math.round(amount * 100) / 100;
    };

    labelFormat = (date, type = "daily") => {
        switch (type) {
            case "monthly":
                return `${date.getFullYear()}/${date.getMonth() + 1}`;
            case "daily":
            default:
                return `${date.getMonth() + 1}/${date.getDate()}`;
        }
    };

    getData = (payments, masterCardActions, type = "daily") => {
        let accountInfo = false;
        this.props.accounts.map(account => {
            if (
                account.MonetaryAccountBank.id === this.props.selectedAccount ||
                this.props.selectedAccount === false
            ) {
                accountInfo = account.MonetaryAccountBank;
            }
        });
        let currentBalance = parseFloat(accountInfo.balance.value);

        let transactionCountData = [];
        let balanceHistoryData = [];
        let labelData = [];
        const dataCollection = {};

        switch (type) {
            case "monthly":
                for (let month = 0; month < 12; month++) {
                    const myDate = new Date();
                    myDate.setMonth(myDate.getMonth() - month);
                    const label = this.labelFormat(myDate, type);

                    dataCollection[label] = [];
                }
                break;
            case "daily":
                for (let day = 0; day < 30; day++) {
                    const dateOffset = day <= 0 ? 0 : 24 * 60 * 60 * 1000 * day;
                    const myDate = new Date();
                    myDate.setTime(myDate.getTime() - dateOffset);
                    const label = this.labelFormat(myDate, type);

                    dataCollection[label] = [];
                }
                break;
        }

        // combine the list
        [...masterCardActions, ...payments]
            .sort((a, b) => {
                return b.date - a.date;
            })
            .forEach(item => {
                const label = this.labelFormat(item.date, type);
                if (dataCollection[label]) {
                    dataCollection[label].push(item);
                }
            });

        // loop through all the days
        Object.keys(dataCollection).map(label => {
            // calculate the total change for that day
            let dailyChange = 0;
            dataCollection[label].map(item => {
                dailyChange = dailyChange + item.change;
            });

            // update balance and push it to the list
            balanceHistoryData.push(this.roundMoney(currentBalance));
            transactionCountData.push(dataCollection[label].length);
            currentBalance = currentBalance + dailyChange;

            // push the label here so we can ignore certain days if required
            labelData.push(label);
        });

        return [
            labelData.reverse(),
            balanceHistoryData.reverse(),
            transactionCountData.reverse()
        ];
    };

    generateChart = (labelData, balanceHistoryData, transactionCountData) => {
        const dataColor1 = "rgb(255, 99, 132)";
        const dataColor2 = "rgb(54, 162, 235)";

        const chartData = {
            labels: labelData,
            datasets: [
                {
                    type: "line",
                    label: "Balance history",
                    data: balanceHistoryData,
                    fill: false,
                    lineTension: 0,
                    pointRadius: 5,
                    borderColor: dataColor1,
                    backgroundColor: dataColor1,
                    pointBorderColor: dataColor1,
                    pointBackgroundColor: dataColor1,
                    pointHoverBackgroundColor: dataColor1,
                    pointHoverBorderColor: dataColor1,
                    yAxisID: "balance"
                },
                {
                    type: "bar",
                    label: "Transactions",
                    data: transactionCountData,
                    fill: false,
                    backgroundColor: dataColor2,
                    borderColor: dataColor2,
                    hoverBackgroundColor: dataColor2,
                    hoverBorderColor: dataColor2,
                    yAxisID: "transaction"
                }
            ]
        };

        const chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            tooltips: {
                enabled: true,
                mode: "nearest"
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: true
                        },
                        labels: labelData
                    }
                ],
                yAxes: [
                    {
                        type: "linear",
                        display: true,
                        position: "left",
                        id: "balance",
                        labels: {
                            show: true
                        },
                        gridLines: {
                            display: true,
                            color: "rgba(239, 158, 175, 0.32)"
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    {
                        type: "linear",
                        display: true,
                        position: "right",
                        id: "transaction",
                        labels: {
                            show: true
                        },
                        gridLines: {
                            display: true,
                            color: "rgba(131, 196, 239, 0.32)"
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: value => {
                                // only show integer values
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        }
                    }
                ]
            }
        };

        return [chartData, chartOptions];
    };

    render() {
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();

        const [
            labelData,
            balanceHistoryData,
            transactionCountData
        ] = this.getData(payments, masterCardActions, "daily");
        const [chartData, chartOptions] = this.generateChart(
            labelData,
            balanceHistoryData,
            transactionCountData
        );

        const [
            labelDataMonthly,
            balanceHistoryDataMonthly,
            transactionCountDataMonthly
        ] = this.getData(payments, masterCardActions, "monthly");
        const [chartDataMonthly, chartOptionsMonthly] = this.generateChart(
            labelDataMonthly,
            balanceHistoryDataMonthly,
            transactionCountDataMonthly
        );

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Stats`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <Paper>
                        <Bar
                            height={450}
                            data={chartData}
                            options={chartOptions}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper>
                        <Bar
                            height={450}
                            data={chartDataMonthly}
                            options={chartOptionsMonthly}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <LoadOlderButton
                        BunqJSClient={this.props.BunqJSClient}
                        initialBunqConnect={this.props.initialBunqConnect}
                    />
                </Grid>
                    <Grid item xs={12}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} md={6}>
                            <Paper>
                                <List component="nav">
                                    <ListSubheader>Statistics</ListSubheader>
                                    <ListItem>
                                        {/*<ListItemIcon>*/}
                                        {/*<InboxIcon />*/}
                                        {/*</ListItemIcon>*/}
                                        <ListItemText
                                            primary="Payments"
                                            secondary={
                                                this.props.payments.length
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        {/*<ListItemIcon>*/}
                                        {/*<InboxIcon />*/}
                                        {/*</ListItemIcon>*/}
                                        <ListItemText
                                            primary="Mastercard payments"
                                            secondary={
                                                this.props.masterCardActions
                                                    .length
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        {/*<ListItemIcon>*/}
                                        {/*<InboxIcon />*/}
                                        {/*</ListItemIcon>*/}
                                        <ListItemText
                                            primary="Requests sent"
                                            secondary={
                                                this.props.requestInquiries
                                                    .length
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        {/*<ListItemIcon>*/}
                                        {/*<InboxIcon />*/}
                                        {/*</ListItemIcon>*/}
                                        <ListItemText
                                            primary="Requests received"
                                            secondary={
                                                this.props.requestResponses
                                                    .length
                                            }
                                        />
                                    </ListItem>
                                    <ListItem>
                                        {/*<ListItemIcon>*/}
                                        {/*<InboxIcon />*/}
                                        {/*</ListItemIcon>*/}
                                        <ListItemText
                                            primary="Bunq.me requests"
                                            secondary={
                                                this.props.bunqMeTabs.length
                                            }
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper>b</Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount,

        payments: state.payments.payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        requestInquiries: state.request_inquiries.request_inquiries,
        requestResponses: state.request_responses.request_responses,
        masterCardActions: state.master_card_actions.master_card_actions,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
