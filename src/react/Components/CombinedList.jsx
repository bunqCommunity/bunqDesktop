import React from "react";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";
import List, { ListItemSecondaryAction, ListSubheader } from "material-ui/List";

import BunqMeTabListItem from "./ListItems/BunqMeTabListItem";
import PaymentListItem from "./ListItems/PaymentListItem";
import MasterCardActionListItem from "./ListItems/MasterCardActionListItem";
import RequestResponseListItem from "./ListItems/RequestResponseListItem";
import RequestInquiryListItem from "./ListItems/RequestInquiryListItem";

import ClearBtn from "../Components/FilterComponents/ClearFilter";
import DisplayDrawerBtn from "../Components/FilterComponents/FilterDrawer";
import { openSnackbar } from "../Actions/snackbar";
import { bunqMeTabPut } from "../Actions/bunq_me_tab";
import { humanReadableDate } from "../Helpers/Utils";

const styles = {
    list: {
        textAlign: "left"
    }
};

class CombinedList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    paymentMapper = () => {
        return this.props.payments.filter(this.paymentFilter).map(payment => {
            return {
                component: (
                    <PaymentListItem
                        payment={payment.Payment}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                ),
                filterDate: payment.Payment.created,
                info: payment.Payment
            };
        });
    };

    paymentFilter = payment => {
        if (this.props.paymentVisibility === false) {
            return false;
        }
        const paymentInfo = payment.Payment;

        // hide mastercard payments
        if (paymentInfo.type === "MASTERCARD") {
            return false;
        }

        if (this.props.paymentType === "received") {
            if (paymentInfo.amount.value <= 0) {
                return false;
            }
        } else if (this.props.paymentType === "sent") {
            if (paymentInfo.amount.value >= 0) {
                return false;
            }
        }
        return true;
    };

    bunqMeTabsMapper = () => {
        return this.props.bunqMeTabs
            .filter(this.bunqMeTabsFilter)
            .map(bunqMeTab => {
                return {
                    component: (
                        <BunqMeTabListItem
                            bunqMeTab={bunqMeTab.BunqMeTab}
                            BunqJSClient={this.props.BunqJSClient}
                            copiedValue={this.copiedValue}
                            bunqMeTabLoading={this.props.bunqMeTabLoading}
                            bunqMeTabsLoading={this.props.bunqMeTabsLoading}
                            bunqMeTabPut={this.props.bunqMeTabPut}
                            user={this.props.user}
                        />
                    ),
                    filterDate: bunqMeTab.BunqMeTab.updated,
                    info: bunqMeTab.BunqMeTab
                };
            });
    };

    bunqMeTabsFilter = bunqMeTab => {
        if (this.props.bunqMeTabVisibility === false) {
            return false;
        }
        switch (this.props.bunqMeTabType) {
            case "active":
                return bunqMeTab.BunqMeTab.status === "WAITING_FOR_PAYMENT";
            case "cancelled":
                return bunqMeTab.BunqMeTab.status === "CANCELLED";
            case "expired":
                return bunqMeTab.BunqMeTab.status === "EXPIRED";
        }
        return true;
    };

    masterCardActionMapper = () => {
        return this.props.masterCardActions
            .filter(this.masterCardActionFilter)
            .map(masterCardAction => {
                return {
                    component: (
                        <MasterCardActionListItem
                            masterCardAction={masterCardAction.MasterCardAction}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: masterCardAction.MasterCardAction.created,
                    info: masterCardAction.MasterCardAction
                };
            });
    };

    masterCardActionFilter = masterCardAction => {
        if (this.props.paymentVisibility === false) {
            return false;
        }

        return this.props.paymentType !== "received";
    };

    requestResponseMapper = () => {
        return this.props.requestResponses
            .filter(this.requestResponseFilter)
            .map(requestResponse => {
                return {
                    component: (
                        <RequestResponseListItem
                            requestResponse={requestResponse.RequestResponse}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestResponse.RequestResponse.created,
                    info: requestResponse.RequestResponse
                };
            });
    };

    requestResponseFilter = requestResponse => {
        if (this.props.requestVisibility === false) {
            return false;
        }

        // hide accepted payments
        if (requestResponse.RequestResponse.status === "ACCEPTED") return false;

        return !(
            this.props.requestType !== "sent" &&
            this.props.requestType !== "default"
        );
    };

    requestInquiryMapper = () => {
        return this.props.requestInquiries
            .filter(this.requestInquiryFilter)
            .map(requestInquiry => {
                return {
                    component: (
                        <RequestInquiryListItem
                            requestInquiry={requestInquiry.RequestInquiry}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestInquiry.RequestInquiry.created,
                    info: requestInquiry.RequestInquiry
                };
            });
    };

    requestInquiryFilter = requestInquiry => {
        if (this.props.requestVisibility === false) {
            return false;
        }

        if (requestInquiry.RequestInquiry.status === "ACCEPTED") return false;

        return !(
            this.props.requestType !== "received" &&
            this.props.requestType !== "default"
        );
    };

    render() {
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
        [
            ...bunqMeTabs,
            ...requestResponses,
            ...masterCardActions,
            ...requestInquiries,
            ...payments
        ]
            .sort(function(a, b) {
                return new Date(b.filterDate) - new Date(a.filterDate);
            })
            .map(item => {
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
                    Payments and requests
                    <ListItemSecondaryAction>
                        <ClearBtn />
                        <DisplayDrawerBtn />
                    </ListItemSecondaryAction>
                </ListSubheader>
                {loadingContent}
                <List>{combinedComponentList}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accountsAccountId: state.accounts.selectedAccount,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

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
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CombinedList);
