import React from "react";
import { withTheme } from "@material-ui/core/styles";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import AccountList from "../../Components/AccountList/AccountList";
import ClearBtn from "../../Components/FilterComponents/ClearFilter";
import FilterDrawer from "../../Components/FilterComponents/FilterDrawer";

import ChartTitle from "./ChartTitle";
import EventCountSection from "./EventCountSection";
import EventCountSidebarSection from "./EventCountSidebarSection";
import EventHistorySection from "./EventHistorySection";

import CategoryCountHistoryChart from "./Chart/Timeline/CategoryCountHistoryChart";
import CategoryTransactionHistoryChart from "./Chart/Timeline/CategoryTransactionHistoryChart";

const StatsWorker = require("worker-loader!../../WebWorkers/stats.worker.js");

const styles = {
    sideBarPaper: {
        padding: 16,
        marginBottom: 16
    }
};

class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            timescale: "weekly",
            parsedData: false,

            // card payments split or combined under mastercardaction
            splitCardTypes: true,

            // transaction amount vs event count
            displayTransactionAmount: true,

            // total, sent or received amount setting
            categoryTransactionType: "total"
        };
        this.worker = new StatsWorker();
        this.worker.onmessage = this.handleWorkerEvent;
    }

    componentWillUnmount() {
        this.worker.terminate();
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        let triggerWorker = false;
        const { timescale, categoryTransactionType } = nextState;
        const { generalFilterDate } = nextProps;

        // check if timescale changed
        if (timescale !== this.state.timescale) triggerWorker = true;
        // check if filter changed
        if (generalFilterDate !== this.props.generalFilterDate) triggerWorker = true;
        // check if category transaction type changed
        if (categoryTransactionType !== this.state.categoryTransactionType) triggerWorker = true;

        const willBeLoading =
            nextProps.bunqMeTabsLoading ||
            nextProps.paymentsLoading ||
            nextProps.requestResponsesLoading ||
            nextProps.requestInquiriesLoading ||
            nextProps.masterCardActionsLoading;
        const isCurrentlyLoading =
            this.props.bunqMeTabsLoading ||
            this.props.paymentsLoading ||
            this.props.requestResponsesLoading ||
            this.props.requestInquiriesLoading ||
            this.props.masterCardActionsLoading;

        if (isCurrentlyLoading === true && willBeLoading === false) {
            // items are no longer loading so we can update trhe worker here
            triggerWorker = true;
        }

        if (triggerWorker) {
            // trigger an update with the next changed props
            this.triggerWorker(this.props, this.state);
        }
        return null;
    }
    componentDidUpdate() {}

    shouldComponentUpdate(nextProps) {
        const nextPropsLoading =
            nextProps.bunqMeTabsLoading ||
            nextProps.paymentsLoading ||
            nextProps.requestResponsesLoading ||
            nextProps.requestInquiriesLoading ||
            nextProps.masterCardActionsLoading;

        if (nextPropsLoading) {
            return false;
        }
        return true;
    }

    componentDidMount() {
        this.triggerWorker();
    }

    handleChange = (event, value) => {
        this.setState({ timescale: value });
    };

    triggerWorker = (props = this.props, state = this.state) => {
        // common values used for the different filter types
        const filterCommonValues = {
            // date filter
            dateFromFilter: props.dateFromFilter,
            dateToFilter: props.dateToFilter,
            searchTerm: this.props.searchTerm,
            amountFilterAmount: this.props.amountFilterAmount,
            amountFilterType: this.props.amountFilterType,
            selectedAccountIds: props.selectedAccountIds,
            toggleAccountIdFilter: props.toggleAccountIdFilter,
            selectedCategories: props.selectedCategories,
            toggleCategoryIds: props.toggleCategoryIds,
            selectedCardIds: props.selectedCardIds,
            toggleCardIds: props.toggleCardIds,
            categories: props.categories,
            categoryConnections: props.categoryConnections,
            displayRequestPayments: false,
            displayAcceptedRequests: true
        };

        this.worker.postMessage({
            // all endpoints
            payments: props.payments.map(item => item.toJSON()),
            masterCardActions: props.masterCardActions.map(item => item.toJSON()),
            requestInquiries: props.requestInquiries.map(item => item.toJSON()),
            requestResponses: props.requestResponses.map(item => item.toJSON()),
            bunqMeTabs: props.bunqMeTabs,
            // different filter objects used in filtering the endpoints
            paymentFilterSettings: {
                paymentVisibility: props.paymentVisibility,
                paymentType: props.paymentType,
                ...filterCommonValues
            },
            bunqMeTabFilterSettings: {
                bunqMeTabVisibility: props.bunqMeTabVisibility,
                bunqMeTabType: props.bunqMeTabType,
                ...filterCommonValues
            },
            requestFilterSettings: {
                requestVisibility: props.requestVisibility,
                paymentVisibility: props.paymentVisibility,
                requestType: props.requestType,
                paymentType: props.paymentType,
                ...filterCommonValues
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
        const { t, theme } = this.props;
        const data =
            this.state.parsedData !== false
                ? this.state.parsedData
                : {
                      labels: [],
                      categoryCountHistory: {},
                      categoryTransactionHistory: {},
                      eventCountHistory: [],
                      // event count
                      requestInquiryHistory: [],
                      requestResponseHistory: [],
                      bunqMeTabHistory: [],
                      paymentHistory: [],
                      masterCardActionHistory: [],
                      maestroPaymentCountHistory: [],
                      tapAndPayPaymentCountHistory: [],
                      applePayPaymentCountHistory: [],
                      masterCardPaymentCountHistory: [],
                      // event transaction amount
                      paymentTransactionHistory: [],
                      requestInquiryTransactionHistory: [],
                      requestResponseTransactionHistory: [],
                      bunqMeTabTransactionHistory: [],
                      masterCardActionTransactionHistory: [],
                      masterCardPaymentTransactionHistory: [],
                      tapAndPayPaymentTransactionHistory: [],
                      maestroPaymentTransactionHistory: [],
                      applePayPaymentTransactionHistory: []
                  };

        const categoryTransactionTypeSelector = this.state.displayTransactionAmount ? (
            <RadioGroup
                aria-label="View the total, sent or received amount for each category"
                style={{
                    flexDirection: "row",
                    justifyContent: "center"
                }}
                name="categoryTransactionType"
                value={this.state.categoryTransactionType}
                onChange={event =>
                    this.setState({
                        categoryTransactionType: event.target.value
                    })
                }
            >
                <FormControlLabel value="total" control={<Radio />} label="Total amount" />
                <FormControlLabel value="sent" control={<Radio />} label="Sent" />
                <FormControlLabel value="received" control={<Radio />} label="Received" />
            </RadioGroup>
        ) : null;

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Stats")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={4} md={3}>
                    <Paper style={styles.sideBarPaper}>
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
                                    <FormControlLabel value="daily" control={<Radio />} label={t("Daily")} />
                                    <FormControlLabel value="weekly" control={<Radio />} label={t("Weekly")} />
                                    <FormControlLabel value="monthly" control={<Radio />} label={t("Monthly")} />
                                    <FormControlLabel value="yearly" control={<Radio />} label={t("Yearly")} />
                                </RadioGroup>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.splitCardTypes}
                                            onChange={event =>
                                                this.setState({
                                                    splitCardTypes: event.target.checked
                                                })
                                            }
                                        />
                                    }
                                    label="Split card types"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.displayTransactionAmount}
                                            onChange={event =>
                                                this.setState({
                                                    displayTransactionAmount: event.target.checked
                                                })
                                            }
                                        />
                                    }
                                    label="Transaction amount vs. event count"
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

                    <Paper style={styles.sideBarPaper}>
                        <AccountList BunqJSClient={this.props.BunqJSClient} denseMode={true} />
                    </Paper>

                    <EventCountSidebarSection
                        t={t}
                        data={data}
                        splitCardTypes={this.state.splitCardTypes}
                        payments={this.props.payments}
                        masterCardActions={this.props.masterCardActions}
                        requestInquiries={this.props.requestInquiries}
                        requestResponses={this.props.requestResponses}
                        bunqMeTabs={this.props.bunqMeTabs}
                    />
                </Grid>

                <Grid item xs={12} sm={8} md={9}>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <EventHistorySection
                                t={t}
                                data={data}
                                theme={theme}
                                categoryTransactionTypeSelector={categoryTransactionTypeSelector}
                                displayTransactionAmount={this.state.displayTransactionAmount}
                                splitCardTypes={this.state.splitCardTypes}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Paper>
                                <ChartTitle t={t}>
                                    {this.state.displayTransactionAmount
                                        ? "Category transaction history"
                                        : "Category count history"}
                                </ChartTitle>

                                <div>
                                    {this.state.displayTransactionAmount ? (
                                        <CategoryTransactionHistoryChart
                                            height={500}
                                            theme={theme}
                                            labels={data.labels}
                                            transactionType={this.state.categoryTransactionType}
                                            categories={this.props.categories}
                                            categoryTransactionHistory={data.categoryTransactionHistory}
                                        />
                                    ) : (
                                        <CategoryCountHistoryChart
                                            height={500}
                                            theme={theme}
                                            labels={data.labels}
                                            categories={this.props.categories}
                                            categoryCountHistory={data.categoryCountHistory}
                                        />
                                    )}
                                </div>
                                {categoryTransactionTypeSelector}
                            </Paper>
                        </Grid>

                        <EventCountSection
                            t={t}
                            data={data}
                            theme={theme}
                            categoryTransactionTypeSelector={categoryTransactionTypeSelector}
                            displayTransactionAmount={this.state.displayTransactionAmount}
                            splitCardTypes={this.state.splitCardTypes}
                            categoryTransactionType={this.state.categoryTransactionType}
                            categories={this.props.categories}
                            payments={this.props.payments}
                            masterCardActions={this.props.masterCardActions}
                            requestInquiries={this.props.requestInquiries}
                            requestResponses={this.props.requestResponses}
                            bunqMeTabs={this.props.bunqMeTabs}
                        />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

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
        generalFilterDate: state.general_filter.date,

        selectedAccountIds: state.account_id_filter.selected_account_ids,
        toggleAccountIds: state.account_id_filter.toggle,
        selectedCategories: state.category_filter.selected_categories,
        toggleCategoryIds: state.category_filter.toggle,
        selectedCardIds: state.card_id_filter.selected_card_ids,
        toggleCardIds: state.card_id_filter.toggle,

        amountFilterAmount: state.amount_filter.amount,
        amountFilterType: state.amount_filter.type
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme()(translate("translations")(Stats)));
