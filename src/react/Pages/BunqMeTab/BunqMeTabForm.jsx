import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { FormControl } from "material-ui/Form";

import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import { openSnackbar } from "../../Actions/snackbar";
import { requestInquirySend } from "../../Actions/request_inquiry";
import ConfirmationDialog from "./ConfirmationDialog";

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
    },
    formattedInput: {
        fontSize: 30
    }
};

class BunqMeTab extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmModalOpen: false,

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

            // redirect url after payment is completed
            setRedirectUrl: false,
            redirectUrlError: false,
            redirectUrl: "",

            // defines which type is used
            targetType: "EMAIL"
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
            this.validateForm
        );
    };
    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target ? event.target.value : event
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

    // validates all the possible input combinations
    validateForm = () => {
        const { description, amount, setRedirectUrl, redirectUrl } = this.state;

        const amountErrorCondition = amount < 0.01 || amount > 10000;
        const descriptionErrorCondition = description.length > 140;
        const redurectUrlErrorCondition =
            setRedirectUrl === true && redirectUrl.length < 5;

        this.setState({
            amountError: amountErrorCondition,
            redurectUrlError: redurectUrlErrorCondition,
            descriptionError: descriptionErrorCondition,
            validForm:
                !amountErrorCondition &&
                !redurectUrlErrorCondition &&
                !descriptionErrorCondition
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

    // send the actual requiry
    sendInquiry = () => {
        if (!this.state.validForm || this.props.payLoading) {
            return false;
        }
        this.closeModal();

        const { accounts, user } = this.props;
        const {
            selectedAccount,
            description,
            amount,
            setRedirectUrl,
            redirectUrl
        } = this.state;
        const account = accounts[selectedAccount].MonetaryAccountBank;
        const userId = user.id;

        const amountInfo = {
            value: amount + "", // sigh
            currency: "EUR"
        };

        let options = {
            redirect_url: setRedirectUrl ? redirectUrl : false
        };

        this.props.requestInquirySend(
            userId,
            account.id,
            description,
            amountInfo,
            options
        );
        this.clearForm();
    };

    render() {
        const { selectedAccount, description, amount } = this.state;
        const account = this.props.accounts[selectedAccount];

        return [
            <Paper style={styles.paper}>
                <Typography type="headline">Request Payment</Typography>

                <AccountSelectorDialog
                    value={this.state.selectedAccount}
                    onChange={this.handleChange("selectedAccount")}
                    accounts={this.props.accounts}
                    BunqJSClient={this.props.BunqJSClient}
                />

                <TextField
                    fullWidth
                    error={this.state.descriptionError}
                    id="description"
                    label="Description"
                    value={this.state.description}
                    onChange={this.handleChange("description")}
                    margin="normal"
                />

                <FormControl
                    style={styles.formControlAlt}
                    error={this.state.amountError}
                    fullWidth
                >
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <MoneyFormatInput
                        id="amount"
                        value={this.state.amount}
                        style={styles.formattedInput}
                        onValueChange={this.handleChangeFormatted}
                        onKeyPress={ev => {
                            if (ev.key === "Enter" && this.state.validForm) {
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
                        !this.state.validForm ||
                        this.props.requestInquiryLoading
                    }
                    style={styles.payButton}
                    onClick={this.openModal}
                >
                    Send request
                </Button>
            </Paper>,
            <ConfirmationDialog
                closeModal={this.closeModal}
                sendInquiry={this.sendInquiry}
                confirmModalOpen={this.state.confirmModalOpen}
                description={description}
                account={account}
                amount={amount}
            />
        ];
    }
}

const mapStateToProps = state => {
    return {
        requestInquiryLoading: state.request_inquiry.loading,
        selectedAccount: state.accounts.selectedAccount,
        accounts: state.accounts.accounts,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        requestInquirySend: (userId, accountId, description, amount, options) =>
            dispatch(
                requestInquirySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    description,
                    amount,
                    options
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTab);
