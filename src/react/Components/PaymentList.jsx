import React from "react";
import { connect } from "react-redux";
import List, { ListItem, ListItemSecondaryAction } from "material-ui/List";
import Divider from "material-ui/Divider";
import { LinearProgress } from "material-ui/Progress";

import PaymentListItem from "./PaymentListItem";
import ClearBtn from "./FilterComponents/ClearFilter";
import DisplayDrawerBtn from "./FilterComponents/DisplayDrawer";

class PaymentList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    paymentFilter = payment => {
        if (this.props.paymentType === "received") {
            if (payment.amount.value <= 0) {
                return false;
            }
        } else if (this.props.paymentType === "sent") {
            if (payment.amount.value >= 0) {
                return false;
            }
        }
        return true;
    };

    render() {
        let payments = [];
        let loadingContent = this.props.paymentsLoading ? (
            <LinearProgress />
        ) : (
            <Divider />
        );

        if (this.props.payments !== false) {
            payments = this.props.payments
                .filter(this.paymentFilter)
                .map(payment => <PaymentListItem payment={payment} />);
        }

        return (
            <List>
                <ListItem>
                    Payments - {payments.length}
                    <ListItemSecondaryAction>
                        <ClearBtn />
                        <DisplayDrawerBtn />
                    </ListItemSecondaryAction>
                </ListItem>

                {loadingContent}
                <List>{payments}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type,
        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentList);
