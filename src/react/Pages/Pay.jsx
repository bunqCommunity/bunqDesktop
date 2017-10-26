import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import NumberFormat from "react-number-format";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import { FormControl } from "material-ui/Form";
import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import PersonIcon from "material-ui-icons/Person";

import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../Helpers/Utils";
import AccountSelectorDialog from "../Components/AccountSelectorDialog";
import { openModal } from "../Actions/modal";
import Logger from "../Helpers/Logger";
import { openSnackbar } from "../Actions/snackbar";

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
            validForm: false,
            selectedAccount: 0,
            amountError: false,
            amount: "",
            descriptionError: false,
            description: "",
            targetError: false,
            target: "NL54BUNQ9900057325",
            ibanNameError: false,
            ibanName: "Finnegan Eenmanszaak",
            targetTypeIban: true
        };
    }

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
                amount: valueObject.value
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
    toggleTargetType = () => {
        this.setState(
            {
                targetTypeIban: !this.state.targetTypeIban
            },
            this.validateForm
        );
    };
    handleMouseDown = event => {
        event.preventDefault();
    };

    validateForm = () => {
        const {
            description,
            amount,
            target,
            ibanName,
            targetTypeIban
        } = this.state;

        this.setState(
            {
                // check for errors
                amountError: amount < 0.01 || amount > 10000,
                descriptionError: description.length > 140,
                ibanNameError: ibanName.length < 1 || ibanName.length > 64,
                targetError: target.length < 5 || target.length > 64
            },
            () => {
                // now set the form valid state based on if we have errors
                const {
                    amountError,
                    descriptionError,
                    ibanNameError,
                    targetError
                } = this.state;
                this.setState({
                    validForm:
                        !amountError &&
                        !descriptionError &&
                        (targetTypeIban && !ibanNameError) &&
                        !targetError
                });
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
        if (!this.state.validForm) {
            return false;
        }

        const { BunqJSClient, accounts, user } = this.props;
        const {
            selectedAccount,
            description,
            amount,
            target,
            ibanName,
            targetTypeIban
        } = this.state;
        const account = accounts[selectedAccount].MonetaryAccountBank;
        const userId = user.id;

        const targetInfo = targetTypeIban
            ? {
                  type: "IBAN",
                  value: target,
                  name: ibanName
              }
            : {
                  type: "EMAIL",
                  value: "finnegan-eenmanszaak@bunq.eu"
              };

        BunqJSClient.api.payment
            .post(
                userId,
                account.id,
                description,
                {
                    value: amount,
                    currency: "EUR"
                },
                targetInfo
            )
            .then(result => {
                this.clearForm();

                this.props.openSnackbar("Payment sent successfully!");
            })
            .catch(error => {
                Logger.error(error.toString());
                Logger.error(error.response.data);
                const response = error.response;

                if (
                    response.headers["content-type"] &&
                    response.headers["content-type"].includes(
                        "application/json"
                    ) &&
                    response.data.Error[0] &&
                    response.data.Error[0].error_description
                ) {
                    // content type is jso
                    this.props.openModal(
                        `We received the following error while sending your payment: 
                        ${response.data.Error[0].error_description}`,
                        "Something went wrong"
                    );
                } else {
                    this.props.openModal(
                        "Something went wrong while trying to send your payment request",
                        "Something went wrong"
                    );
                }
            });
    };

    render() {
        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <Typography type="headline">New Payment</Typography>
                        <Typography type="body1">This page is still experimental!</Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChangeDirect(
                                "selectedAccount"
                            )}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        <FormControl fullWidth>
                            <InputLabel htmlFor="target">
                                {this.state.targetTypeIban ? (
                                    "IBAN"
                                ) : (
                                    "Email or phone"
                                )}
                            </InputLabel>
                            <Input
                                fullWidth
                                required
                                error={this.state.targetError}
                                id="target"
                                type={
                                    this.state.targetTypeIban ? "text" : "email"
                                }
                                value={this.state.target}
                                onChange={this.handleChange("target")}
                                inputProps={{ style: styles.inputWithIcon }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.toggleTargetType}
                                            onMouseDown={this.handleMouseDown}
                                        >
                                            {this.state.targetTypeIban ? (
                                                <AccountBalanceIcon />
                                            ) : (
                                                <PersonIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {this.state.targetTypeIban ? (
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    error={this.state.ibanNameError}
                                    id="ibanName"
                                    label="IBAN name"
                                    value={this.state.ibanName}
                                    onChange={this.handleChange("ibanName")}
                                    margin="normal"
                                />
                            </FormControl>
                        ) : null}

                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                error={this.state.descriptionError}
                                id="description"
                                label="Description"
                                value={this.state.description}
                                onChange={this.handleChange("description")}
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl style={styles.formControlAlt}>
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <NumberFormat
                                required
                                error={this.state.amountError}
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
        accounts: state.accounts.accounts,
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openModal: (message, title) => dispatch(openModal(message, title)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
