import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

import DeleteIcon from "@material-ui/icons/Delete";

import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import ConfirmationDialog from "./ConfirmationDialog";
import PendingPaymentRow from "./PendingPaymentRow";

import { formatMoney } from "../../Functions/Utils";
import BunqErrorHandler from "../../Functions/BunqErrorHandler";

import {
    pendingPaymentsClear,
    pendingPaymentsClearAccount,
    pendingPaymentsRemovePayment
} from "../../Actions/pending_payments";
import { openSnackbar } from "../../Actions/snackbar";

const styles = {
    paper: {
        padding: 16
    },
    titleGrid: {
        padding: 8
    },
    titleButtonGrid: {
        textAlign: "right",
        padding: 8
    },
    button: {
        margin: 8
    },
    deleteIconTableCell: {
        width: 48
    },
    amountTableCell: {
        width: 100,
        padding: "4px 24px 4px 24px"
    },
    accountTableCell: {},
    accountWrapper: {
        display: "flex",
        alignItems: "center"
    },
    checkTableBoxCell: {
        width: 48
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
            selectedCheckBoxes: {},

            confirmText: "",
            confirmCallback: () => {},

            paymentPromiseCount: 0
        };
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousState.paymentPromiseCount > 0 && this.state.paymentPromiseCount <= 0) {
            this.props.openSnackbar(this.props.t("Finished handling the selected payments"));

            this.setState({
                paymentPromiseCount: 0
            });
        }
    }

    confirmAction = (text, callback) => {
        this.setState({
            confirmText: text,
            confirmCallback: (...params) => {
                callback(params);
                this.clearConfirmAction();
            }
        });
    };
    clearConfirmAction = () => {
        this.setState({
            confirmText: "",
            confirmCallback: () => {}
        });
    };

    clearAll = () => {
        this.confirmAction("Are you sure you wish to remove all pending payments?", () => {
            this.props.pendingPaymentsClear();
            this.setState({ selectedCheckBoxes: {} });
        });
    };
    clearAccount = accountId => e => {
        this.confirmAction("Are you sure you wish to remove all pending payments for this account?", () => {
            this.props.pendingPaymentsClearAccount(accountId);
            this.setState({ selectedCheckBoxes: {} });
        });
    };
    removePayment = paymendtId => e => {
        this.confirmAction("Are you sure you wish to remove this pending payment?", () => {
            this.props.pendingPaymentsRemovePayment(paymendtId);
            this.setState({ selectedCheckBoxes: {} });
        });
    };
    removeSelected = () => {
        this.confirmAction("Are you sure you wish to remove the selected pending payments?", () => {
            const pendingPayments = this.props.pendingPayments;
            const selectedCheckBoxes = this.state.selectedCheckBoxes;
            Object.keys(selectedCheckBoxes).forEach(checkboxId => {
                if (pendingPayments[checkboxId] && selectedCheckBoxes[checkboxId]) {
                    this.props.pendingPaymentsRemovePayment(checkboxId);
                }
            });
            this.setState({ selectedCheckBoxes: {} });
        });
    };

    togglePaymentCheckBox = pendingPaymentId => e => {
        const pendingPayments = this.props.pendingPayments;
        const selectedCheckBoxes = { ...this.state.selectedCheckBoxes };
        selectedCheckBoxes[pendingPaymentId] = !selectedCheckBoxes[pendingPaymentId];

        if (!selectedCheckBoxes[pendingPaymentId]) {
            selectedCheckBoxes[pendingPayments[pendingPaymentId].account_id] = false;
            selectedCheckBoxes["all"] = false;
        }

        this.setState({
            selectedCheckBoxes: selectedCheckBoxes
        });
    };
    toggleAccountCheckBox = accountId => e => {
        const pendingPayments = this.props.pendingPayments;
        const selectedCheckBoxes = { ...this.state.selectedCheckBoxes };
        selectedCheckBoxes[accountId] = !selectedCheckBoxes[accountId];

        if (!selectedCheckBoxes[accountId]) {
            selectedCheckBoxes["all"] = false;
        }

        // filter payment items by the selected account id
        const accountMatchedPayments = Object.keys(pendingPayments).filter(pendingPaymentId => {
            return pendingPayments[pendingPaymentId].account_id === accountId;
        });

        // go through the matched types and set them to the same value as the account row
        accountMatchedPayments.forEach(accountMatchedPayment => {
            selectedCheckBoxes[accountMatchedPayment] = selectedCheckBoxes[accountId];
        });

        this.setState({
            selectedCheckBoxes: selectedCheckBoxes
        });
    };
    toggleAllCheckbox = e => {
        const pendingPayments = this.props.pendingPayments;
        const selectedCheckBoxes = { ...this.state.selectedCheckBoxes };
        selectedCheckBoxes["all"] = !selectedCheckBoxes["all"];

        // go through the matched types and set them to the same value as the account row
        Object.keys(pendingPayments).forEach(pendingPaymentId => {
            selectedCheckBoxes[pendingPaymentId] = selectedCheckBoxes["all"];
            selectedCheckBoxes[pendingPayments[pendingPaymentId].account_id] = selectedCheckBoxes["all"];
        });

        this.setState({
            selectedCheckBoxes: selectedCheckBoxes
        });
    };

    parsePendingPayments = () => {
        const pendingPayments = this.props.pendingPayments;
        const selectedCheckBoxes = this.state.selectedCheckBoxes;

        const groupedPendingPayments = {};
        Object.keys(selectedCheckBoxes).forEach(checkboxId => {
            const pendingPayment = pendingPayments[checkboxId];
            if (pendingPayment && selectedCheckBoxes[checkboxId]) {
                if (!groupedPendingPayments[pendingPayment.account_id]) {
                    groupedPendingPayments[pendingPayment.account_id] = [];
                }
                groupedPendingPayments[pendingPayment.account_id].push(pendingPayment);
            }
        });

        const groupedParsedPayments = {};
        Object.keys(groupedPendingPayments).map(accountIdString => {
            groupedParsedPayments[accountIdString] = [];

            groupedPendingPayments[accountIdString].forEach(pendingPayment => {
                const paymentObject = pendingPayment.payment;

                if (groupedParsedPayments[accountIdString].length >= 50) {
                    return;
                }

                if (paymentObject.counterparty_aliases) {
                    const { counterparty_aliases, ...paymentDetails } = paymentObject;
                    if (counterparty_aliases.length + groupedParsedPayments[accountIdString].length > 50) {
                        // ignore if this target list will cause the amount to go over 50
                        return;
                    }

                    counterparty_aliases.forEach(counterParty => {
                        // add each counterparty separately as a single payment
                        groupedParsedPayments[accountIdString].push({
                            ...paymentDetails,
                            counterparty_alias: counterParty
                        });
                    });
                } else {
                    groupedParsedPayments[accountIdString].push(paymentObject);
                }

                // remove this payment since it's added to the queue
                this.props.pendingPaymentsRemovePayment(pendingPayment.id);
            });
        });

        return groupedParsedPayments;
    };

    incrementPromiseCounter = () => this.setState({ paymentPromiseCount: this.state.paymentPromiseCount + 1 });
    decrementPromiseCounter = () => this.setState({ paymentPromiseCount: this.state.paymentPromiseCount - 1 });

    paySelected = () => {
        const { t, BunqJSClient, user } = this.props;
        const failedText = t("Failed to complete some of the selected payments");

        this.confirmAction("Are you sure you wish to complete these payments?", () => {
            const groupedParsedPayments = this.parsePendingPayments();

            Object.keys(groupedParsedPayments).map(accountIdString => {
                const accountId = parseFloat(accountIdString);

                this.incrementPromiseCounter();
                BunqJSClient.api.paymentBatch
                    .postRaw(user.id, accountId, groupedParsedPayments[accountIdString])
                    .then(result => {
                        this.decrementPromiseCounter();
                    })
                    .catch(error => {
                        this.props.BunqErrorHandler(error, failedText);
                        this.decrementPromiseCounter();
                    });
            });

            this.setState({ selectedCheckBoxes: {} });
        });
    };
    draftSelected = () => {
        const { t, BunqJSClient, user } = this.props;
        const failedText = t("Failed to draft some of the selected payments");

        this.confirmAction("Are you sure you wish to draft these payments?", () => {
            const groupedParsedPayments = this.parsePendingPayments();

            Object.keys(groupedParsedPayments).map(accountIdString => {
                const accountId = parseFloat(accountIdString);

                this.incrementPromiseCounter();
                BunqJSClient.api.draftPayment
                    .postRaw(user.id, accountId, groupedParsedPayments[accountIdString])
                    .then(result => {
                        this.decrementPromiseCounter();
                    })
                    .catch(error => {
                        this.props.BunqErrorHandler(error, failedText);
                        this.decrementPromiseCounter();
                    });
            });

            this.setState({ selectedCheckBoxes: {} });
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

        const hasSelectedCheckboxes = Object.keys(this.state.selectedCheckBoxes).some(selectedCheckboxId => {
            return this.state.selectedCheckBoxes[selectedCheckboxId];
        });

        let componentList = [];
        Object.keys(groupedPayments).forEach(accountIdStr => {
            const accountId = parseFloat(accountIdStr);
            const groupedPaymentList = groupedPayments[accountId];

            const accountInfo = accounts.find(account => account.id == accountId);
            if (!accountInfo) return;
            const imageUUID = accountInfo.avatar.image[0].attachment_public_uuid;

            let accountSpentTotal = 0;
            const paymentItems = groupedPaymentList.map(pendingPayment => {
                const paymentObject = pendingPayment.payment;
                accountSpentTotal = accountSpentTotal + parseFloat(paymentObject.amount.value);
                return (
                    <PendingPaymentRow
                        pendingPayment={pendingPayment}
                        accounts={this.props.accounts}
                        removePayment={this.removePayment}
                        togglePaymentCheckBox={this.togglePaymentCheckBox}
                        selectedCheckBoxes={this.state.selectedCheckBoxes}
                    />
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
                            <TableCell style={styles.amountTableCell}>
                                <Typography>Total:</Typography>
                                <Typography>{formatMoney(accountSpentTotal)}</Typography>
                            </TableCell>
                            <TableCell style={styles.accountTableCell}>
                                <div style={styles.accountWrapper}>
                                    <Avatar style={styles.avatar}>
                                        <LazyAttachmentImage
                                            height={40}
                                            BunqJSClient={BunqJSClient}
                                            imageUUID={imageUUID}
                                        />
                                    </Avatar>
                                    <div>
                                        <Typography variant="body1">{accountInfo.description}</Typography>
                                        <Typography variant="body2">{formatMoney(accountInfo.getBalance())}</Typography>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell style={styles.deleteIconTableCell}>
                                <IconButton onClick={this.clearAccount(accountId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{paymentItems}</TableBody>
                </React.Fragment>
            );
        });

        const paperContent = (
            <Grid container>
                <Grid item xs={8} style={styles.titleGrid}>
                    <TranslateTypography variant="h5">Pending payments</TranslateTypography>
                </Grid>
                <Grid item xs={4} style={styles.titleButtonGrid}>
                    {componentList.length > 0 && (
                        <Button color="secondary" variant="outlined" onClick={this.clearAll}>
                            Clear all
                        </Button>
                    )}
                </Grid>

                <Grid item style={{ flexGrow: 1 }}>
                    <Button
                        style={styles.button}
                        color="primary"
                        variant="contained"
                        disabled={!hasSelectedCheckboxes || componentList.length === 0}
                        onClick={this.paySelected}
                    >
                        Pay selected
                    </Button>
                    <Button
                        style={styles.button}
                        color="primary"
                        variant="contained"
                        disabled={!hasSelectedCheckboxes || componentList.length === 0}
                        onClick={this.draftSelected}
                    >
                        Draft selected
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        style={styles.button}
                        color="secondary"
                        variant="contained"
                        disabled={!hasSelectedCheckboxes || componentList.length === 0}
                        onClick={this.removeSelected}
                    >
                        Remove selected
                    </Button>
                </Grid>

                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" style={styles.checkTableBoxCell}>
                                    <Checkbox
                                        color="primary"
                                        checked={!!this.state.selectedCheckBoxes["all"]}
                                        onChange={this.toggleAllCheckbox}
                                    />
                                </TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Account</TableCell>
                                <TableCell style={styles.deleteIconTableCell} />
                            </TableRow>
                        </TableHead>
                        {componentList}
                    </Table>
                </Grid>
            </Grid>
        );

        return (
            <Grid container spacing={8}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Pending payments")}`}</title>
                </Helmet>

                <ConfirmationDialog
                    onClose={this.clearConfirmAction}
                    onConfirm={this.state.confirmCallback}
                    open={this.state.confirmText.length > 0}
                    text={this.state.confirmText}
                />

                <Grid item xs={12}>
                    <Paper style={styles.paper}>{paperContent}</Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts,

        pendingPaymentsLastUpdated: state.pending_payments.last_updated,
        pendingPayments: state.pending_payments.pending_payments
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const BunqJSClient = ownProps.BunqJSClient;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        BunqErrorHandler: (error, message) => BunqErrorHandler(dispatch, error, message, BunqJSClient),

        pendingPaymentsClear: () => dispatch(pendingPaymentsClear()),
        pendingPaymentsClearAccount: accountId => dispatch(pendingPaymentsClearAccount(BunqJSClient, accountId)),
        pendingPaymentsRemovePayment: pendingPaymentId =>
            dispatch(pendingPaymentsRemovePayment(BunqJSClient, pendingPaymentId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(PendingPayments));
