import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

import { formatMoney } from "../../Helpers/Utils";

import {
    pendingPaymentsClear,
    pendingPaymentsAddPayment,
    pendingPaymentsAddPayments,
    pendingPaymentsClearAccount,
    pendingPaymentsRemovePayment
} from "../../Actions/pending_payments";

const styles = {
    checkTableBoxCell: {
        width: 72
    },
    accountTableCell: {
        display: "flex",
        alignItems: "center"
    },
    avatar: {
        width: 40,
        height: 40,
        marginRight: 12
    }
};

class PendingPayments extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCheckBoxes: {}
        };
    }

    togglePaymentCheckBox = checkBoxId => e => {
        const selectedCheckBoxes = { ...this.state.selectedCheckBoxes };
        selectedCheckBoxes[checkBoxId] = !selectedCheckBoxes[checkBoxId];
        this.setState({
            selectedCheckBoxes: selectedCheckBoxes
        });
    };

    toggleAccountCheckBox = accountId => e => {
        const pendingPayments = this.props.pendingPayments;
        const selectedCheckBoxes = { ...this.state.selectedCheckBoxes };
        selectedCheckBoxes[accountId] = !selectedCheckBoxes[accountId];

        // filter payment items by the selected account id
        const accountMatchedPayments = Object.keys(pendingPayments).filter(pendingPaymentId => {
            return pendingPayments[pendingPaymentId].account_id === accountId;
        });

        // go through the matched types and set them to the same value as the account row
        accountMatchedPayments.forEach(accountMatchedPayment => {
            const paymentCheckboxId = `payment-${accountMatchedPayment}`;
            selectedCheckBoxes[paymentCheckboxId] = selectedCheckBoxes[accountId];
        });

        this.setState({
            selectedCheckBoxes: selectedCheckBoxes
        });
    };

    render() {
        const { t, BunqJSClient, accounts, pendingPayments } = this.props;

        let groupedPayments = {};
        Object.keys(pendingPayments).forEach(pendingPaymentId => {
            const pendingPayment = pendingPayments[pendingPaymentId];
            if (!groupedPayments[pendingPayment.account_id]) {
                groupedPayments[pendingPayment.account_id] = [];
            }
            groupedPayments[pendingPayment.account_id].push(pendingPayment);
        });

        let componentList = [];
        Object.keys(groupedPayments).forEach(accountIdStr => {
            const accountId = parseFloat(accountIdStr);
            const groupedPaymentList = groupedPayments[accountId];

            const accountInfo = accounts.find(account => account.id == accountId);
            if (!accountInfo) return;
            const imageUUID = accountInfo.avatar.image[0].attachment_public_uuid;

            const paymentItems = groupedPaymentList.map(pendingPayment => {
                const paymentObject = pendingPayment.payment;
                // console.log(pendingPayment);

                const paymentCheckboxId = `payment-${pendingPayment.id}`;
                return (
                    <TableRow key={paymentCheckboxId}>
                        <TableCell padding="checkbox" style={styles.checkTableBoxCell}>
                            <Checkbox
                                color="primary"
                                checked={!!this.state.selectedCheckBoxes[paymentCheckboxId]}
                                onChange={this.togglePaymentCheckBox(paymentCheckboxId)}
                            />
                        </TableCell>
                        <TableCell>Targets</TableCell>
                        <TableCell>{formatMoney(paymentObject.amount.value)}</TableCell>
                    </TableRow>
                );
            });

            componentList.push(
                <React.Fragment key={accountId}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" style={styles.checkTableBoxCell}>
                                <Checkbox
                                    color="primary"
                                    checked={!!this.state.selectedCheckBoxes[accountId]}
                                    onChange={this.toggleAccountCheckBox(accountId)}
                                />
                            </TableCell>
                            <TableCell style={styles.accountTableCell}>
                                <Avatar style={styles.avatar}>
                                    <LazyAttachmentImage
                                        height={40}
                                        BunqJSClient={BunqJSClient}
                                        imageUUID={imageUUID}
                                    />
                                </Avatar>
                                <Typography variant="body1">{accountInfo.description}</Typography>
                            </TableCell>
                            <TableCell>{formatMoney(accountInfo.getBalance())}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{paymentItems}</TableBody>
                </React.Fragment>
            );
        });

        return (
            <Grid container spacing={8}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Pending payments")}`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <Paper>
                        <Table>
                            {/*<TableHead>*/}
                            {/*<TableRow>*/}
                            {/*<TableCell>Dessert (100g serving)</TableCell>*/}
                            {/*<TableCell numeric>Calories</TableCell>*/}
                            {/*<TableCell numeric>Fat (g)</TableCell>*/}
                            {/*<TableCell numeric>Carbs (g)</TableCell>*/}
                            {/*<TableCell>Protein (g)</TableCell>*/}
                            {/*</TableRow>*/}
                            {/*</TableHead>*/}
                            {componentList}
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        pendingPaymentsLastUpdated: state.pending_payments.last_updated,
        pendingPayments: state.pending_payments.pending_payments
    };
};

const mapDispatchToProps = dispatch => {
    return {
        pendingPaymentsRemovePayment: pendingPaymentId => dispatch(pendingPaymentsRemovePayment(pendingPaymentId)),
        pendingPaymentsAddPayment: (accountId, pendingPayment) =>
            dispatch(pendingPaymentsAddPayment(accountId, pendingPayment)),
        pendingPaymentsAddPayments: (accountId, pendingPayments) =>
            dispatch(pendingPaymentsAddPayments(accountId, pendingPayments)),
        pendingPaymentsClear: () => dispatch(pendingPaymentsClear()),
        pendingPaymentsClearAccount: () => dispatch(pendingPaymentsClearAccount())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(PendingPayments));
