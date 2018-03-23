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
import ClearBtn from "../../Components/FilterComponents/ClearFilter";
import FilterDrawer from "../../Components/FilterComponents/FilterDrawer";
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
        this.worker.terminate();
    }

    componentWillUpdate(nextProps, nextState) {
        let triggerWorker = false;
        const { timescale } = this.state;
        const { generalFilterDate } = this.props;

        // if any of these values changed we should always update
        if (timescale !== nextState.timescale) triggerWorker = true;
        if (generalFilterDate !== nextProps.generalFilterDate)
            triggerWorker = true;

        const isCurrentlyLoading =
            this.props.bunqMeTabsLoading ||
            this.props.paymentsLoading ||
            this.props.requestResponsesLoading ||
            this.props.requestInquiriesLoading ||
            this.props.masterCardActionsLoading;
        const willBeLoading =
            nextProps.bunqMeTabsLoading ||
            nextProps.paymentsLoading ||
            nextProps.requestResponsesLoading ||
            nextProps.requestInquiriesLoading ||
            nextProps.masterCardActionsLoading;

        if (isCurrentlyLoading === true && willBeLoading === false) {
            // items are no longer loading so we can update trhe worker here
            triggerWorker = true;
        }

        if (triggerWorker) {
            // trigger an update with the next changed props
            this.triggerWorker(nextProps, nextState);
        }
    }

    componentDidMount() {
        this.triggerWorker();
    }

    handleChange = (event, value) => {
        this.setState({ timescale: value });
    };

    triggerWorker = (props = this.props, state = this.state) => {
        this.worker.postMessage({
            // all endpoints
            payments: props.payments,
            masterCardActions: props.masterCardActions,
            bunqMeTabs: props.bunqMeTabs,
            requestInquiries: props.requestInquiries,
            requestResponses: props.requestResponses,

            // the accounts and selectedAccount so a balance can be calculated
            accounts: props.accounts.map(account => account.toJSON()),
            selectedAccount: props.selectedAccount,

            // different filter objects used in filtering the endpoints
            paymentFilterSettings: {
                paymentVisibility: props.paymentVisibility,
                paymentType: props.paymentType,
                dateFromFilter: props.dateFromFilter,
                dateToFilter: props.dateToFilter
            },
            bunqMeTabFilterSettings: {
                bunqMeTabVisibility: props.bunqMeTabVisibility,
                bunqMeTabType: props.bunqMeTabType,
                dateFromFilter: props.dateFromFilter,
                dateToFilter: props.dateToFilter
            },
            requestFilterSettings: {
                requestVisibility: props.requestVisibility,
                requestType: props.requestType,
                dateFromFilter: props.dateFromFilter,
                dateToFilter: props.dateToFilter
            },

            // category data
            categories: props.categories,
            categoryConnections: props.categoryConnections,

            // date range filters and timescale setting
            timeTo: props.dateToFilter,
            timeFrom: props.dateFromFilter,
            timescale: state.timescale
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
            <Grid item xs={12} key={"balancechart"}>
                <Paper>
                    <BalanceHistoryChart
                        height={500}
                        labels={data.labels}
                        balanceHistoryData={data.balanceHistoryData}
                        eventCountHistory={data.eventCountHistory}
                    />
                </Paper>
            </Grid>,
            <Grid item xs={12} key={"eventschart"}>
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

                                <Grid item xs={12}>
                                    <FilterDrawer
                                        bigButton={true}
                                        buttonProps={{
                                            style: {
                                                width: "100%"
                                            },
                                            color: "primary"
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <ClearBtn
                                        bigButton={true}
                                        buttonProps={{
                                            style: {
                                                width: "100%"
                                            },
                                            color: "secondary"
                                        }}
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

        categories: state.categories.categories,
        categoryConnections: state.categories.category_connections,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,
        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,
        generalFilterDate: state.general_filter.date
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
