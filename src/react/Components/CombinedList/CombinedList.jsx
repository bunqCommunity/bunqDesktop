import React from "react";
import { connect } from "react-redux";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";
import List, { ListItemSecondaryAction, ListSubheader } from "material-ui/List";

import PaymentListItem from "./PaymentListItem";
import MasterCardActionListItem from "./MasterCardActionListItem";
import RequestResponseListItem from "./RequestResponseListItem";
import ClearBtn from "../../Components/FilterComponents/ClearFilter";
import DisplayDrawerBtn from "../../Components/FilterComponents/FilterDrawer";

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

    paymentFilter = payment => {
        const paymentInfo = payment.Payment;
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

    masterCardActionFilter = masterCardAction => {
        // const paymentInfo = payment.Payment;
        // if (this.props.paymentType === "received") {
        //     if (paymentInfo.amount.value <= 0) {
        //         return false;
        //     }
        // } else if (this.props.paymentType === "sent") {
        //     if (paymentInfo.amount.value >= 0) {
        //         return false;
        //     }
        // }
        return true;
    };

    requestResponseFilter = requestResponse => {
        // const paymentInfo = payment.Payment;
        // if (this.props.paymentType === "received") {
        //     if (paymentInfo.amount.value <= 0) {
        //         return false;
        //     }
        // } else if (this.props.paymentType === "sent") {
        //     if (paymentInfo.amount.value >= 0) {
        //         return false;
        //     }
        // }
        return true;
    };

    render() {
        let loadingContent =
            this.props.paymentsLoading ||
            this.props.requestResponsesLoading ||
            this.props.masterCardActionsLoading ? (
                <LinearProgress />
            ) : (
                <Divider />
            );

        const payments = this.props.payments
            .filter(this.paymentFilter)
            .map(payment => {
                return {
                    component: (
                        <PaymentListItem
                            payment={payment.Payment}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: payment.Payment.updated,
                    info: payment.Payment
                };
            });

        const masterCardActions = this.props.masterCardActions
            .filter(this.requestResponseFilter)
            .map(masterCardAction => {
                return {
                    component: (
                        <MasterCardActionListItem
                            masterCardAction={masterCardAction}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: masterCardAction.updated,
                    info: masterCardAction
                };
            });

        const requestResponses = this.props.requestResponses
            .filter(this.requestResponseFilter)
            .map(requestResponse => {
                return {
                    component: (
                        <RequestResponseListItem
                            requestResponse={requestResponse.RequestResponse}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                    ),
                    filterDate: requestResponse.RequestResponse.updated,
                    info: requestResponse.RequestResponse
                };
            });

        // combine the list and order by the prefered date for this item
        const combinedFilteredList = [
            ...requestResponses,
            ...payments,
            ...masterCardActions
        ].sort(function(a, b) {
            return new Date(b.filterDate) - new Date(a.filterDate);
        });

        // get only the component from the item
        const combinedComponentList = combinedFilteredList.map(
            item => item.component
        );

        return (
            <List style={styles.left}>
                <ListSubheader>
                    Payments
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

        requestResponses: state.request_responses.request_responses,
        requestResponsesLoading: state.request_responses.loading,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

export default connect(mapStateToProps)(CombinedList);
