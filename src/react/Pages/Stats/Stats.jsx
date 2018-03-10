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

import LoadOlderButton from "../../Components/LoadOlderButton";
import StatsWorker from "../../WebWorkers/stats.worker";
import PieChart from "./PieChart";
import BalanceHistoryChart from "./BalanceHistoryChart";
import EventTypeHistoryChart from "./EventTypeHistoryChart";

class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timescale: "daily",
            parsedData: false
        };
    }

    componentWillMount() {
        this.worker = new StatsWorker();
        this.worker.onmessage = this.handleWorkerEvent;
    }

    componentWillUnmount() {
        this.worker.destroy();
    }

    componentDidMount() {
        this.triggerWorker();
    }

    handleChange = (event, value) => {
        this.setState({ timescale: value }, () => {
            this.triggerWorker();
        });
    };

    triggerWorker = () => {
        this.worker.postMessage({
            payments: this.props.payments,
            masterCardActions: this.props.masterCardActions,
            bunqMeTabs: this.props.bunqMeTabs,
            requestInquiries: this.props.requestInquiries,
            requestResponses: this.props.requestResponses,
            accounts: this.props.accounts,

            selectedAccount: this.props.selectedAccount,
            paymentFilterSettings: {
                paymentVisibility: this.props.paymentVisibility,
                paymentType: this.props.paymentType
            },
            timescale: this.state.timescale
        });
    };

    handleWorkerEvent = event => {
        this.setState({ parsedData: event.data });
    };

    render() {
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

        const data =
            this.state.parsedData !== false
                ? this.state.parsedData
                : {
                      labels: [],
                      balanceHistoryData: [],
                      eventCountHistory: [],
                      masterCardActionHistory: [],
                      requestInquiryHistory: [],
                      requestResponseHistory: [],
                      bunqMeTabHistory: [],
                      paymentHistory: []
                  };

        let bigCharts = [
            <Grid item xs={12}>
                <Paper>
                    <BalanceHistoryChart
                        height={500}
                        labels={data.labels}
                        balanceHistoryData={data.balanceHistoryData}
                        eventCountHistory={data.eventCountHistory}
                    />
                </Paper>
            </Grid>,
            <Grid item xs={12}>
                <Paper>
                    <EventTypeHistoryChart
                        height={500}
                        labels={data.labels}
                        masterCardActionHistory={data.masterCardActionHistory}
                        requestInquiryHistory={data.requestInquiryHistory}
                        requestResponseHistory={data.requestResponseHistory}
                        bunqMeTabHistory={data.bunqMeTabHistory}
                        paymentHistory={data.paymentHistory}
                    />
                </Paper>
            </Grid>
        ];

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
                        {bigCharts}

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

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading,
        masterCardActionsLoading: state.master_card_actions.loading,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
