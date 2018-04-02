import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText } from "material-ui/List";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormControlLabel } from "material-ui/Form";

import AccountList from "../../Components/AccountList/AccountList";
import LoadOlderButton from "../../Components/LoadOlderButton";
import ClearBtn from "../../Components/FilterComponents/ClearFilter";
import FilterDrawer from "../../Components/FilterComponents/FilterDrawer";
import StatsWorker from "../../WebWorkers/stats.worker";
import EventCountPieChart from "./EventCountPieChart";
import CategoryCountPieChart from "./CategoryCountPieChart";
import CategoryHistoryChart from "./CategoryHistoryChart";
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
            payments: props.payments.map(item => item.toJSON()),
            masterCardActions: props.masterCardActions.map(item =>
                item.toJSON()
            ),
            requestInquiries: props.requestInquiries.map(item => item.toJSON()),
            requestResponses: props.requestResponses.map(item => item.toJSON()),
            bunqMeTabs: props.bunqMeTabs,

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
        const t = this.props.t;

        const data =
            this.state.parsedData !== false
                ? this.state.parsedData
                : {
                    labels: [],
                    balanceHistoryData: [],
                    categoryCountHistory: {},
                    eventCountHistory: [],
                    masterCardActionHistory: [],
                    requestInquiryHistory: [],
                    requestResponseHistory: [],
                    bunqMeTabHistory: [],
                    paymentHistory: []
                };

        const eventCountStats = (
            <Grid item xs={12}>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper>
                            <List component="nav">
                                <ListSubheader>{t("Statistics")}</ListSubheader>
                                <ListItem>
                                    <ListItemText
                                        primary={t("Payments")}
                                        secondary={this.props.payments.length}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={t("Mastercard payments")}
                                        secondary={
                                            this.props.masterCardActions.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={t("Requests sent")}
                                        secondary={
                                            this.props.requestInquiries.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={t("Requests received")}
                                        secondary={
                                            this.props.requestResponses.length
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary={t("bunqme Requests")}
                                        secondary={this.props.bunqMeTabs.length}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper
                            style={{
                                padding: 12
                            }}
                        >
                            <EventCountPieChart
                                height={500}
                                payments={this.props.payments}
                                masterCardActions={this.props.masterCardActions}
                                requestInquiries={this.props.requestInquiries}
                                requestResponses={this.props.requestResponses}
                                bunqMeTabs={this.props.bunqMeTabs}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper>
                            <CategoryCountPieChart
                                height={500}
                                categories={this.props.categories}
                                categoryCountHistory={data.categoryCountHistory}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        );

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Stats")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={4} md={3}>
                    <Paper
                        style={{
                            padding: 16,
                            marginBottom: 16
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
                                        label={t("Daily")}
                                    />
                                    <FormControlLabel
                                        value="weekly"
                                        control={<Radio />}
                                        label={t("Weekly")}
                                    />
                                    <FormControlLabel
                                        value="monthly"
                                        control={<Radio />}
                                        label={t("Monthly")}
                                    />
                                    <FormControlLabel
                                        value="yearly"
                                        control={<Radio />}
                                        label={t("Yearly")}
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

                    <Paper
                        style={{
                            padding: 16
                        }}
                    >
                        <AccountList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                            denseMode={true}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={8} md={9}>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <Paper>
                                <EventTypeHistoryChart
                                    height={500}
                                    labels={data.labels}
                                    masterCardActionHistory={
                                        data.masterCardActionHistory
                                    }
                                    requestInquiryHistory={
                                        data.requestInquiryHistory
                                    }
                                    requestResponseHistory={
                                        data.requestResponseHistory
                                    }
                                    bunqMeTabHistory={data.bunqMeTabHistory}
                                    paymentHistory={data.paymentHistory}
                                />
                            </Paper>
                        </Grid>

                        {eventCountStats}

                        <Grid item xs={12}>
                            <Paper>
                                <CategoryHistoryChart
                                    height={500}
                                    labels={data.labels}
                                    categories={this.props.categories}
                                    categoryCountHistory={
                                        data.categoryCountHistory
                                    }
                                />
                            </Paper>
                        </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Stats)
);
