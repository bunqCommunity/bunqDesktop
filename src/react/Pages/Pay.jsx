import React from "react";
import iban from "iban";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import EmailValidator from "email-validator";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import { InputLabel } from "material-ui/Input";
import List, { ListItem, ListItemText } from "material-ui/List";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Radio from "material-ui/Radio";
import Switch from "material-ui/Switch";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";

import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";
import PhoneIcon from "material-ui-icons/Phone";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";

import AccountSelectorDialog from "../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";
import PhoneFormatInput from "../Components/FormFields/PhoneFormatInput";
import { openSnackbar } from "../Actions/snackbar";
import { paySend } from "../Actions/pay";

const styles = {
    payButton: {
        width: "100%"
    },
    formControlAlt: {
        marginBottom: 10
    },
    paper: {
        padding: 24,
        textAlign: "left"
    }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmModalOpen: false,

            // if true, a draft-payment will be sent instead of a default payment
            sendDraftPayment: false,

            // when false, don't allow payment request
            validForm: false,

            // source wallet has insuffient funds
            insufficientFundsCondition: false,

            // top account selection picker
            selectedAccount: 0,

            // amount input field
            amountError: false,
            amount: "",

            // description input field
            descriptionError: false,
            description: "",

            // default target field
            targetError: false,
            target: "",

            // name field for IBAN targets
            ibanNameError: false,
            ibanName: "",

            // targeted account for transfers
            selectedTargetAccount: 1,
            selectedTargetAccountError: false,

            // defines which type is used
            targetType: "IBAN"
        };
    }

    componentDidMount() {
        // set the current account selected on the dashboard as the active one
        this.props.accounts.map((account, accountKey) => {
            if (this.props.selectedAccount === account.MonetaryAccountBank.id) {
                this.setState({ selectedAccount: accountKey });
            }
        });
    }

    closeModal = () => {
        this.setState({ confirmModalOpen: false });
    };
    openModal = () => {
        this.setState({ confirmModalOpen: true });
    };

    // callbacks for input fields and selectors
    setTargetType = type => event => {
        this.setState(
            {
                targetType: type,
                target: ""
            },
            () => {
                this.setState({
                    amountError: false,
                    insufficientFundsCondition: false,
                    descriptionError: false,
                    ibanNameError: false,
                    targetError: false,
                    validForm: false
                });
            }
        );
    };
    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            this.validateForm
        );
    };
    handleChangeFormatted = valueObject => {
        this.setState(
            {
                amount:
                    valueObject.formattedValue.length > 0
                        ? valueObject.floatValue
                        : ""
            },
            this.validateForm
        );
    };
    handleChangeDirect = name => value => {
        this.setState(
            {
                [name]: value
            },
            this.validateForm
        );
    };

    // validates all the possible input combinations
    validateForm = () => {
        const {
            description,
            amount,
            target,
            ibanName,
            selectedAccount,
            selectedTargetAccount,
            targetType
        } = this.state;

        const account = this.props.accounts[selectedAccount]
            .MonetaryAccountBank;

        const insufficientFundsCondition =
            amount !== "" &&
            amount > (account.balance ? account.balance.value : 0);
        const amountErrorCondition = amount < 0.01 || amount > 10000;
        const descriptionErrorCondition = description.length > 140;
        const ibanNameErrorCondition =
            ibanName.length < 1 || ibanName.length > 64;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "EMAIL":
                targetErrorCondition = !EmailValidator.validate(target);
                break;
            case "PHONE":
                targetErrorCondition = target.length < 5 || target.length > 64;
                break;
            case "TRANSFER":
                targetErrorCondition =
                    selectedAccount === selectedTargetAccount;
                break;
            default:
            case "IBAN":
                const filteredTarget = target.replace(/ /g, "");
                targetErrorCondition =
                    iban.isValid(filteredTarget) === false ||
                    ibanNameErrorCondition === true;
                break;
        }

        this.setState({
            amountError: amountErrorCondition,
            insufficientFundsCondition: insufficientFundsCondition,
            descriptionError: descriptionErrorCondition,
            ibanNameError: ibanNameErrorCondition,
            targetError: targetErrorCondition,
            validForm:
                !insufficientFundsCondition &&
                !amountErrorCondition &&
                !descriptionErrorCondition &&
                !targetErrorCondition
        });
    };

    // clears the input fields to default
    clearForm = () => {
        this.setState(
            {
                amount: "",
                description: ""
            },
            this.validateForm
        );
    };

    // send the actual payment
    sendPayment = () => {
        if (!this.state.validForm || this.props.payLoading) {
            return false;
        }
        this.closeModal();

        const { accounts, user } = this.props;
        const {
            sendDraftPayment,
            selectedAccount,
            selectedTargetAccount,
            description,
            amount,
            target,
            ibanName,
            targetType
        } = this.state;
        const account = accounts[selectedAccount].MonetaryAccountBank;
        const userId = user.id;

        // check if the target is valid based onthe targetType
        let targetInfo = false;
        switch (targetType) {
            case "EMAIL":
                targetInfo = {
                    type: "EMAIL",
                    value: target.trim()
                };
                break;
            case "PHONE":
                targetInfo = {
                    type: "PHONE_NUMBER",
                    value: target.trim()
                };
                break;
            case "TRANSFER":
                const otherAccount =
                    accounts[selectedTargetAccount].MonetaryAccountBank;

                otherAccount.alias.map(alias => {
                    if (alias.type === "IBAN") {
                        targetInfo = {
                            type: "IBAN",
                            value: alias.value.trim(),
                            name: alias.name
                        };
                    }
                });
                break;
            default:
            case "IBAN":
                const filteredTarget = target.replace(/ /g, "");
                targetInfo = {
                    type: "IBAN",
                    value: filteredTarget,
                    name: ibanName
                };
                break;
        }

        const amountInfo = {
            value: amount + "", // sigh
            currency: "EUR"
        };

        this.props.paySend(
            userId,
            account.id,
            description,
            amountInfo,
            targetInfo,
            sendDraftPayment
        );
        this.clearForm();
    };

    render() {
        const {
            selectedTargetAccount,
            selectedAccount,
            description,
            targetType,
            ibanName,
            amount,
            target
        } = this.state;

        let confirmationModal = null;
        if (this.state.confirmModalOpen) {
            const account = this.props.accounts[selectedAccount]
                .MonetaryAccountBank;
            const filteredTarget = target.replace(/ /g, "");

            confirmationModal = (
                <Dialog
                    open={this.state.confirmModalOpen}
                    keepMounted
                    onRequestClose={this.closeModal}
                >
                    <DialogTitle>Confirm the payment</DialogTitle>
                    <DialogContent>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="From"
                                    secondary={`${account.description} ${account
                                        .balance.value}
                                    ${account.balance.currency}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Description"
                                    secondary={description}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Amount"
                                    secondary={`${amount.toFixed(2)} ${account
                                        .balance.currency}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="To"
                                    secondary={(() => {
                                        switch (targetType) {
                                            case "PHONE":
                                                return `Phone: ${target}`;
                                            case "EMAIL":
                                                return `Email: ${target}`;
                                            case "IBAN":
                                                return `IBAN: ${filteredTarget} - Name: ${ibanName}`;
                                            case "TRANSFER":
                                                const account = this.props
                                                    .accounts[
                                                    selectedTargetAccount
                                                ].MonetaryAccountBank;
                                                return `Transfer ${account.description}`;
                                        }
                                    })()}
                                />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button raised onClick={this.closeModal} color="accent">
                            Cancel
                        </Button>
                        <Button
                            raised
                            onClick={this.sendPayment}
                            color="primary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        const targetTypeSelection = (
            <Grid container spacing={24}>
                <Grid item xs={6} sm={3}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<AccountBalanceIcon />}
                                checkedIcon={<AccountBalanceIcon />}
                                checked={this.state.targetType === "IBAN"}
                                onChange={this.setTargetType("IBAN")}
                                value="IBAN"
                                name="target-type-iban"
                            />
                        }
                        label="IBAN"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<EmailIcon />}
                                checkedIcon={<EmailIcon />}
                                color={"accent"}
                                checked={this.state.targetType === "EMAIL"}
                                onChange={this.setTargetType("EMAIL")}
                                value="EMAIL"
                                name="target-type-email"
                            />
                        }
                        label="EMAIL"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<PhoneIcon />}
                                checkedIcon={<PhoneIcon />}
                                color={"accent"}
                                checked={this.state.targetType === "PHONE"}
                                onChange={this.setTargetType("PHONE")}
                                value="PHONE"
                                name="target-type-phone"
                            />
                        }
                        label="PHONE"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<CompareArrowsIcon />}
                                checkedIcon={<CompareArrowsIcon />}
                                color={"accent"}
                                checked={this.state.targetType === "TRANSFER"}
                                onChange={this.setTargetType("TRANSFER")}
                                value="TRANSFER"
                                name="target-type-transfer"
                            />
                        }
                        label="Transfer"
                    />
                </Grid>
            </Grid>
        );

        let targetContent = null;
        switch (this.state.targetType) {
            case "TRANSFER":
                targetContent = (
                    <AccountSelectorDialog
                        id="target"
                        value={this.state.selectedTargetAccount}
                        onChange={this.handleChangeDirect(
                            "selectedTargetAccount"
                        )}
                        accounts={this.props.accounts}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                );
                break;
            case "PHONE":
                targetContent = (
                    <FormControl fullWidth error={this.state.targetError}>
                        <Typography type="body1">
                            Phone numbers should contain no spaces and include
                            the land code. For example: +316123456789
                        </Typography>
                        <PhoneFormatInput
                            id="target"
                            placeholder="+316123456789"
                            error={this.state.targetError}
                            value={this.state.target}
                            onChange={this.handleChange("target")}
                        />
                    </FormControl>
                );
                break;
            case "EMAIL":
                targetContent = (
                    <TextField
                        error={this.state.targetError}
                        fullWidth
                        required
                        id="target"
                        type="email"
                        label="Email"
                        value={this.state.target}
                        onChange={this.handleChange("target")}
                    />
                );
                break;
            default:
            case "IBAN":
                targetContent = [
                    <TextField
                        error={this.state.targetError}
                        fullWidth
                        required
                        id="target"
                        label="IBAN number"
                        value={this.state.target}
                        onChange={this.handleChange("target")}
                    />,
                    <TextField
                        fullWidth
                        required
                        error={this.state.ibanNameError}
                        id="ibanName"
                        label="IBAN name"
                        value={this.state.ibanName}
                        onChange={this.handleChange("ibanName")}
                        margin="normal"
                    />
                ];
                break;
        }

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <Typography type="headline">New Payment</Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChangeDirect(
                                "selectedAccount"
                            )}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                        {this.state.insufficientFundsCondition !== false ? (
                            <InputLabel error={true}>
                                Your source account does not have sufficient
                                funds!
                            </InputLabel>
                        ) : null}

                        {targetTypeSelection}

                        {targetContent}

                        <TextField
                            fullWidth
                            error={this.state.descriptionError}
                            id="description"
                            label="Description"
                            value={this.state.description}
                            onChange={this.handleChange("description")}
                            margin="normal"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    checked={this.state.sendDraftPayment}
                                    onChange={() =>
                                        this.setState({
                                            sendDraftPayment: !this.state
                                                .sendDraftPayment
                                        })}
                                />
                            }
                            label="Draft a new payment instead of directly sending it?"
                        />

                        <FormControl
                            style={styles.formControlAlt}
                            error={this.state.amountError}
                            fullWidth
                        >
                            <MoneyFormatInput
                                id="amount"
                                value={this.state.amount}
                                onValueChange={this.handleChangeFormatted}
                                onKeyPress={ev => {
                                    if (
                                        ev.key === "Enter" &&
                                        this.state.validForm
                                    ) {
                                        this.openModal();
                                        ev.preventDefault();
                                    }
                                }}
                            />
                        </FormControl>

                        <Button
                            raised
                            color="primary"
                            disabled={
                                !this.state.validForm || this.props.payLoading
                            }
                            style={styles.payButton}
                            onClick={this.openModal}
                        >
                            Pay
                        </Button>
                    </Paper>

                    {confirmationModal}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        payLoading: state.pay.loading,
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        paySend: (
            userId,
            accountId,
            description,
            amount,
            target,
            draft = false
        ) =>
            dispatch(
                paySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    description,
                    amount,
                    target,
                    draft
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
