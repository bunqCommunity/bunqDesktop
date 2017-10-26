import React from "react";
import iban from "iban";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import NumberFormat from "react-number-format";
import EmailValidator from "email-validator";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Radio from "material-ui/Radio";
import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";
import PhoneIcon from "material-ui-icons/Phone";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";

import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../Helpers/Utils";
import AccountSelectorDialog from "../Components/AccountSelectorDialog";
import { openModal } from "../Actions/modal";
import { openSnackbar } from "../Actions/snackbar";
import { paySend } from "../Actions/pay";

const styles = {
    payButton: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    },
    formControlAlt: {
        width: "100%",
        marginBottom: 10
    },
    paper: {
        padding: 24,
        textAlign: "left"
    },
    formattedInput: {
        fontSize: 30
    },
    inputWithIcon: { width: "calc(100% - 62px)" }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // when false, don't allow payment request
            validForm: false,
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

    setTargetType = type => event => {
        this.setState(
            {
                targetType: type,
                target: ""
            },
            this.validateForm
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
                targetErrorCondition = !iban.isValid(target);
                break;
        }

        this.setState(
            {
                // check for errors
                amountError: amountErrorCondition,
                descriptionError: descriptionErrorCondition,
                ibanNameError: ibanNameErrorCondition,
                targetError: targetErrorCondition
            },
            () => {
                // now set the form valid state based on if we have errors
                if (targetType === "IBAN") {
                    this.setState({
                        validForm:
                            !this.state.amountError &&
                            !this.state.descriptionError &&
                            !this.state.ibanNameError &&
                            !this.state.targetError
                    });
                } else {
                    this.setState({
                        validForm:
                            !this.state.amountError &&
                            !this.state.descriptionError &&
                            !this.state.targetError
                    });
                }
            }
        );
    };

    clearForm = () => {
        this.setState(
            {
                amount: "",
                description: ""
            },
            this.validateForm
        );
    };

    sendPayment = () => {
        if (!this.state.validForm || this.props.payLoading) {
            return false;
        }

        const { accounts, user } = this.props;
        const {
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
                    value: target
                };
                break;
            case "PHONE":
                targetInfo = {
                    type: "PHONE_NUMBER",
                    value: target
                };
                break;
            case "TRANSFER":
                const otherAccount =
                    accounts[selectedTargetAccount].MonetaryAccountBank;

                otherAccount.alias.map(alias => {
                    if (alias.type === "IBAN") {
                        targetInfo = {
                            type: "IBAN",
                            value: alias.value,
                            name: alias.name
                        };
                    }
                });
                break;
            default:
            case "IBAN":
                targetInfo = {
                    type: "IBAN",
                    value: target,
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
            targetInfo
        );
        this.clearForm();
    };

    render() {
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
                        <TextField
                            error={this.state.targetError}
                            fullWidth
                            required
                            id="target"
                            label="Phone number"
                            value={this.state.target}
                            onChange={this.handleChange("target")}
                        />
                    </FormControl>
                );
                break;
            case "EMAIL":
                targetContent = (
                    <FormControl fullWidth error={this.state.targetError}>
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
                    </FormControl>
                );
                break;
            default:
            case "IBAN":
                targetContent = (
                    <div>
                        <FormControl fullWidth error={this.state.targetError}>
                            <TextField
                                error={this.state.targetError}
                                fullWidth
                                required
                                id="target"
                                label="IBAN number"
                                value={this.state.target}
                                onChange={this.handleChange("target")}
                            />
                        </FormControl>
                        <FormControl fullWidth error={this.state.ibanNameError}>
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
                        </FormControl>
                    </div>
                );
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
                        <Typography type="body1">
                            This page is still experimental!
                        </Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChangeDirect(
                                "selectedAccount"
                            )}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        {targetTypeSelection}

                        {targetContent}

                        <FormControl
                            fullWidth
                            error={this.state.descriptionError}
                        >
                            <TextField
                                fullWidth
                                // error={this.state.descriptionError}
                                id="description"
                                label="Description"
                                value={this.state.description}
                                onChange={this.handleChange("description")}
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl
                            style={styles.formControlAlt}
                            error={this.state.amountError}
                        >
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <NumberFormat
                                required
                                // error={this.state.amountError}
                                id="amount"
                                value={this.state.amount}
                                style={styles.formattedInput}
                                onValueChange={this.handleChangeFormatted}
                                margin="normal"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                decimalSeparator={preferedDecimalSeparator}
                                thousandSeparator={preferedThousandSeparator}
                                prefix={"€"}
                                customInput={Input}
                            />
                        </FormControl>

                        <Button
                            raised
                            color="primary"
                            disabled={!this.state.validForm}
                            style={styles.payButton}
                            onClick={this.sendPayment}
                        >
                            Pay
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        payLoading: state.pay.loading,
        accounts: state.accounts.accounts,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        openModal: (message, title) => dispatch(openModal(message, title)),
        paySend: (userId, accountId, description, amount, target) =>
            dispatch(
                paySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    description,
                    amount,
                    target
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
