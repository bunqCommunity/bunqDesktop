import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import InfoIcon from "@material-ui/icons/Info";

import BunqMeTabListItem from "../ListItems/BunqMeTabListItem";
import PaymentListItem from "../ListItems/PaymentListItem";
import MasterCardActionListItem from "../ListItems/MasterCardActionListItem";
import RequestResponseListItem from "../ListItems/RequestResponseListItem";
import RequestInquiryListItem from "../ListItems/RequestInquiryListItem";
import ClearBtn from "../FilterComponents/ClearFilter";
import FilterDrawer from "../FilterComponents/FilterDrawer";
import EventData from "./EventData";

import { openSnackbar } from "../../Actions/snackbar";
import { bunqMeTabPut } from "../../Actions/bunq_me_tab";
import {
    nextPage,
    previousPage,
    setPage,
    setPageSize,
    firstPage
} from "../../Actions/pagination";

import { humanReadableDate } from "../../Helpers/Utils";
import {
    paymentFilter,
    bunqMeTabsFilter,
    masterCardActionFilter,
    requestInquiryFilter,
    requestResponseFilter
} from "../../Helpers/DataFilters";

const styles = {
    button: {
        width: "100%"
    },
    pageField: {
        width: 60
    },
    list: {
        textAlign: "left"
    },
    leftPaginationDiv: {
        marginRight: 4
    },
    centerPaginationDiv: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    rightPaginationDiv: {
        marginLeft: 4
    }
};

class CombinedList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            displayEventData: false
        };
    }

    shouldComponentUpdate(nextProps) {
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

        // don't update the components if we are loading now and will be loading in the next update
        if (isCurrentlyLoading && willBeLoading) return false;

        return true;
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    toggleEventData = event =>
        this.setState({ displayEventData: !this.state.displayEventData });

    paymentMapper = () => {
        if (this.props.hiddenTypes.includes("Payment")) return [];

        return this.props.payments
            .filter(
                paymentFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    searchTerm: this.props.searchTerm,
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(payment => {
                return {
                    component: (
                        <PaymentListItem
                            payment={payment}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: payment.created,
                    info: payment
                };
            });
    };

    bunqMeTabsMapper = () => {
        if (this.props.hiddenTypes.includes("BunqMeTab")) return [];

        return this.props.bunqMeTabs
            .filter(
                bunqMeTabsFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    searchTerm: this.props.searchTerm,
                    bunqMeTabVisibility: this.props.bunqMeTabVisibility,
                    bunqMeTabType: this.props.bunqMeTabType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(bunqMeTab => {
                return {
                    component: (
                        <BunqMeTabListItem
                            bunqMeTab={bunqMeTab}
                            BunqJSClient={this.props.BunqJSClient}
                            copiedValue={this.copiedValue}
                            bunqMeTabLoading={this.props.bunqMeTabLoading}
                            bunqMeTabsLoading={this.props.bunqMeTabsLoading}
                            bunqMeTabPut={this.props.bunqMeTabPut}
                            user={this.props.user}
                        />
                    ),
                    filterDate: bunqMeTab.created,
                    info: bunqMeTab
                };
            });
    };

    masterCardActionMapper = () => {
        if (this.props.hiddenTypes.includes("MasterCardAction")) return [];

        return this.props.masterCardActions
            .filter(
                masterCardActionFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    searchTerm: this.props.searchTerm,
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(masterCardAction => {
                return {
                    component: (
                        <MasterCardActionListItem
                            masterCardAction={masterCardAction}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: masterCardAction.created,
                    info: masterCardAction
                };
            });
    };

    requestResponseMapper = () => {
        if (this.props.hiddenTypes.includes("RequestResponse")) return [];

        return this.props.requestResponses
            .filter(
                requestResponseFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    searchTerm: this.props.searchTerm,
                    requestVisibility: this.props.requestVisibility,
                    requestType: this.props.requestType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(requestResponse => {
                return {
                    component: (
                        <RequestResponseListItem
                            requestResponse={requestResponse}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestResponse.created,
                    info: requestResponse
                };
            });
    };

    requestInquiryMapper = () => {
        if (this.props.hiddenTypes.includes("RequestInquiry")) return [];

        return this.props.requestInquiries
            .filter(
                requestInquiryFilter({
                    categories: this.props.categories,
                    categoryConnections: this.props.categoryConnections,
                    selectedCategories: this.props.selectedCategories,

                    searchTerm: this.props.searchTerm,
                    requestVisibility: this.props.requestVisibility,
                    requestType: this.props.requestType,
                    dateFromFilter: this.props.dateFromFilter,
                    dateToFilter: this.props.dateToFilter
                })
            )
            .map(requestInquiry => {
                return {
                    component: (
                        <RequestInquiryListItem
                            requestInquiry={requestInquiry}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestInquiry.created,
                    info: requestInquiry
                };
            });
    };

    lastPage = page => () => {
        this.props.setPage(page);
    };
    setPage = pageCount => event => {
        let page = event.target.value - 1;
        pageCount = pageCount - 1;

        if (page < 0) page = 0;
        if (page > pageCount) page = pageCount;

        this.props.setPage(page);
    };
    setPageSize = event => {
        this.props.setPage(0);
        this.props.setPageSize(event.target.value);
    };

    render() {
        const { page, pageSize, t } = this.props;
        let loadingContent =
            this.props.bunqMeTabsLoading ||
            this.props.paymentsLoading ||
            this.props.requestResponsesLoading ||
            this.props.requestInquiriesLoading ||
            this.props.masterCardActionsLoading ? (
                <LinearProgress />
            ) : (
                <Divider />
            );

        // create arrays of the different endpoint types
        const bunqMeTabs = this.bunqMeTabsMapper();
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();
        const requestResponses = this.requestResponseMapper();
        const requestInquiries = this.requestInquiryMapper();

        let groupedItems = {};

        // combine the list, order by date and group by day
        const events = [
            ...bunqMeTabs,
            ...requestResponses,
            ...masterCardActions,
            ...requestInquiries,
            ...payments
        ].sort(function(a, b) {
            return new Date(b.filterDate) - new Date(a.filterDate);
        });

        // check if all pages is set (pageSize = 0)
        const usedPageSize = pageSize === 0 ? events.length : pageSize;
        // calculate last page
        const unRoundedPageCount = events.length / usedPageSize;
        const pageCount = unRoundedPageCount
            ? Math.ceil(unRoundedPageCount)
            : 1;
        // create a smaller list based on the page and pageSize
        const slicedEvents = events.slice(
            page * usedPageSize,
            (page + 1) * usedPageSize
        );

        slicedEvents.map(item => {
            const dateFull = new Date(item.filterDate);
            const date = new Date(
                dateFull.getFullYear(),
                dateFull.getMonth(),
                dateFull.getDate(),
                0,
                0,
                0
            );
            if (!groupedItems[date.getTime()]) {
                groupedItems[date.getTime()] = {
                    date: dateFull,
                    components: []
                };
            }

            // add item to this date group
            groupedItems[date.getTime()].components.push(item.component);
        });

        const combinedComponentList = [];
        Object.keys(groupedItems).map(dateLabel => {
            const groupedItem = groupedItems[dateLabel];

            // get the human readable text for this date group
            const groupTitleText = humanReadableDate(
                parseFloat(dateLabel),
                false
            );

            // add a header component for this date
            combinedComponentList.push([
                <ListSubheader>{groupTitleText}</ListSubheader>,
                <Divider />
            ]);

            // add the components to the list
            return groupedItem.components.map(component =>
                combinedComponentList.push(component)
            );
        });

        return (
            <List style={styles.left}>
                <ListSubheader>
                    {t("Payments and requests")}: {events.length}
                    <ListItemSecondaryAction>
                        <ClearBtn />
                        <IconButton onClick={this.toggleEventData}>
                            <InfoIcon />
                        </IconButton>
                        <FilterDrawer />
                    </ListItemSecondaryAction>
                </ListSubheader>

                <ListSubheader>
                    <Grid container>
                        <Grid item xs={1}>
                            <IconButton
                                style={styles.button}
                                onClick={this.props.firstPage}
                                disabled={page === 0}
                            >
                                <SkipPreviousIcon />
                            </IconButton>
                        </Grid>

                        <Grid item xs={1}>
                            <IconButton
                                style={styles.button}
                                onClick={this.props.previousPage}
                                disabled={page === 0}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </Grid>

                        <Grid item xs={4} style={styles.centerPaginationDiv}>
                            <TextField
                                style={styles.pageField}
                                value={page + 1}
                                type={"number"}
                                inputProps={{
                                    min: 1,
                                    max: pageCount,
                                    step: 1
                                }}
                                onChange={this.setPage(pageCount)}
                            />
                        </Grid>

                        <Grid item xs={4} style={styles.centerPaginationDiv}>
                            <TextField
                                select
                                style={styles.pageField}
                                value={pageSize}
                                onChange={this.setPageSize}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={0}>All</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={1}>
                            <IconButton
                                style={styles.button}
                                onClick={this.props.nextPage}
                                disabled={page + 1 >= pageCount}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </Grid>

                        <Grid item xs={1}>
                            <IconButton
                                style={styles.button}
                                onClick={this.lastPage(pageCount - 1)}
                                disabled={page + 1 >= pageCount}
                            >
                                <SkipNextIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </ListSubheader>

                <EventData
                    t={t}
                    events={events}
                    open={this.state.displayEventData}
                />

                {loadingContent}
                {combinedComponentList}
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsAccountId: state.accounts.selectedAccount,

        page: state.pagination.page,
        pageSize: state.pagination.page_size,

        searchTerm: state.search_filter.search_term,
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,
        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date,
        selectedCategories: state.category_filter.selected_categories,

        categories: state.categories.categories,
        categoryConnections: state.categories.category_connections,

        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        bunqMeTabLoading: state.bunq_me_tab.loading,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        requestInquiries: state.request_inquiries.request_inquiries,
        requestInquiriesLoading: state.request_inquiries.loading,

        requestResponses: state.request_responses.request_responses,
        requestResponsesLoading: state.request_responses.loading,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        bunqMeTabPut: (userId, accountId, tabId, status) =>
            dispatch(
                bunqMeTabPut(BunqJSClient, userId, accountId, tabId, status)
            ),
        firstPage: () => dispatch(firstPage()),
        nextPage: () => dispatch(nextPage()),
        previousPage: () => dispatch(previousPage()),
        setPageSize: size => dispatch(setPageSize(size)),
        setPage: page => dispatch(setPage(page))
    };
};

CombinedList.defaultProps = {
    hiddenTypes: []
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(CombinedList)
);
