import React from "react";
import { connect } from "react-redux";
import StickyBox from "react-sticky-box";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText } from "material-ui/List";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormControlLabel } from "material-ui/Form";

import Divider from "material-ui/Divider";
import InboxIcon from "material-ui-icons/Inbox";

import LoadOlderButton from "../../Components/LoadOlderButton";
import PieChart from "./PieChart";
import BalanceHistoryChart from "./BalanceHistoryChart";
import EventTypeHistoryChart from "./EventTypeHistoryChart";

import {
    masterCardActionFilter,
    paymentFilter
} from "../../Helpers/DataFilters";
import { getWeek } from "../../Helpers/Utils";

class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timescale: "daily"
        };
    }

    bunqMeTabMapper = () => {
        const data = [];
        this.props.bunqMeTabs.map(bunqMeTab => {
            data.push({
                date: new Date(bunqMeTab.BunqMeTab.created),
                change: 0,
                type: "bunqMeTab"
            });
        });
        return data;
    };

    requestInquiryMapper = () => {
        const data = [];
        this.props.requestInquiries.map(requestInquiry => {
            data.push({
                date: new Date(requestInquiry.RequestInquiry.created),
                change: 0,
                type: "requestInquiry"
            });
        });
        return data;
    };

    requestResponseMapper = () => {
        const data = [];
        this.props.requestResponses.map(requestResponse => {
            data.push({
                date: new Date(requestResponse.RequestResponse.created),
                change: 0,
                type: "requestResponse"
            });
        });
        return data;
    };

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
                    type: "payment"
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
                        type: "masterCardAction"
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

    getData = (events, type = "daily") => {
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
                    const label = this.labelFormat(myDate, type);

                    dataCollection[label] = [];
                }
                break;
            case "monthly":
                for (let month = 0; month < 12; month++) {
                    const myDate = new Date();
                    myDate.setMonth(myDate.getMonth() - month);
                    const label = this.labelFormat(myDate, type);

                    dataCollection[label] = [];
                }
                break;
            case "weekly":
                for (let week = 0; week < 52; week++) {
                    const dateOffset =
                        week <= 0 ? 0 : 24 * 60 * 60 * 1000 * 7 * week;
                    const myDate = new Date();
                    myDate.setTime(myDate.getTime() - dateOffset);
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
        events
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
            balanceHistoryData.push(this.roundMoney(currentBalance));
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

    handleChange = (event, value) => {
        this.setState({ timescale: value });
    };

    render() {
        const bunqMeTabs = this.bunqMeTabMapper();
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();
        const requestResponses = this.requestResponseMapper();
        const requestInquiries = this.requestInquiryMapper();

        // combine them all
        const events = [
            ...bunqMeTabs,
            ...requestResponses,
            ...masterCardActions,
            ...requestInquiries,
            ...payments
        ];

        // parse all the data
        const {
            labels,
            balanceHistoryData,
            eventCountHistory,
            masterCardActionHistory,
            requestInquiryHistory,
            requestResponseHistory,
            bunqMeTabHistory,
            paymentHistory
        } = this.getData(events, this.state.timescale);

        const eventCountStats = (
            <Grid item xs={12}>
                <Grid container spacing={16}>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            <List component="nav">
                                <ListSubheader>Statistics</ListSubheader>
                                <ListItem>
                                    <ListItemText
                                        primary="Payments"
                                        secondary={this.props.payments.length}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Mastercard payments"
                                        secondary={
                                            this.props.masterCardActions.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Requests sent"
                                        secondary={
                                            this.props.requestInquiries.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Requests received"
                                        secondary={
                                            this.props.requestResponses.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Bunq.me requests"
                                        secondary={this.props.bunqMeTabs.length}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            style={{
                                padding: 12
                            }}
                        >
                            <PieChart
                                payments={this.props.payments}
                                masterCardActions={this.props.masterCardActions}
                                requestInquiries={this.props.requestInquiries}
                                requestResponses={this.props.requestResponses}
                                bunqMeTabs={this.props.bunqMeTabs}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        );

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Stats`}</title>
                </Helmet>

                <Grid item xs={12} sm={4} md={3} lg={2}>
                    <StickyBox className={"sticky-container"}>
                        <Paper
                            style={{
                                padding: 16
                            }}
                        >
                            <Grid container spacing={16}>
                                <Grid
                                    item
                                    xs={12}
                                    style={{
                                        display: "flex"
                                    }}
                                >
                                    <RadioGroup
                                        aria-label="timescale"
                                        name="timescale"
                                        value={this.state.timescale}
                                        onChange={this.handleChange}
                                    >
                                        <FormControlLabel
                                            value="daily"
                                            control={<Radio />}
                                            label="Daily"
                                        />
                                        <FormControlLabel
                                            value="weekly"
                                            control={<Radio />}
                                            label="Weekly"
                                        />
                                        <FormControlLabel
                                            value="monthly"
                                            control={<Radio />}
                                            label="Monthly"
                                        />
                                        <FormControlLabel
                                            value="yearly"
                                            control={<Radio />}
                                            label="Yearly"
                                        />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadOlderButton
                                        wrapperStyle={{ margin: 0 }}
                                        buttonStyle={{ width: "100%" }}
                                        BunqJSClient={this.props.BunqJSClient}
                                        initialBunqConnect={
                                            this.props.initialBunqConnect
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </StickyBox>
                </Grid>

                <Grid item xs={12} sm={8} md={9} lg={10}>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <Paper>
                                <BalanceHistoryChart
                                    height={500}
                                    labels={labels}
                                    balanceHistoryData={balanceHistoryData}
                                    eventCountHistory={eventCountHistory}
                                />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper>
                                <EventTypeHistoryChart
                                    height={500}
                                    labels={labels}
                                    masterCardActionHistory={
                                        masterCardActionHistory
                                    }
                                    requestInquiryHistory={
                                        requestInquiryHistory
                                    }
                                    requestResponseHistory={
                                        requestResponseHistory
                                    }
                                    bunqMeTabHistory={bunqMeTabHistory}
                                    paymentHistory={paymentHistory}
                                />
                            </Paper>
                        </Grid>

                        {eventCountStats}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        theme: state.options.theme,

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
