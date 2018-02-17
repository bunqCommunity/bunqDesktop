import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import EmailValidator from "email-validator";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";
import Switch from "material-ui/Switch";
import { FormControl, FormControlLabel } from "material-ui/Form";

import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import PhoneFormatInput from "../../Components/FormFields/PhoneFormatInput";
import { openSnackbar } from "../../Actions/snackbar";
import { requestInquirySend } from "../../Actions/request_inquiry";
import TargetSelection from "./TargetSelection";
import MinimumAge from "./Options/MinimumAge";
import RedirectUrl from "../../Components/FormFields/RedirectUrl";
import ConfirmationDialog from "./ConfirmationDialog";
import AllowBunqMe from "./Options/AllowBunqMe";

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

class RequestInquiry extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expandedCollapse: false,
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

            // allow bunq.me requests for this inquiry
            allowBunqMe: true,

            // minimum age input field - false or integer between 12 and 100
            setMinimumAge: false,
            minimumAgeError: false,
            minimumAge: 18,

            // redirect url after payment is completed
            setRedirectUrl: false,
            redirectUrlError: false,
            redirectUrl: "",

            // default target field
            targetError: false,
            target: "",

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
    toggleExpanded = () => {
        this.setState({
            expandedCollapse: !this.state.expandedCollapse
        });
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
                    minimumAgeError: false,
                    redurectUrlError: false,
                    descriptionError: false,
                    targetError: false,
                    validForm: false
                });
            }
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
    handleToggle = name => event => {
        this.setState(
            {
                [name]: !this.state[name]
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
        const {
            description,
            amount,
            target,
            setMinimumAge,
            minimumAge,
            setRedirectUrl,
            redirectUrl,
            targetType
        } = this.state;
        const minimumAgeInt = parseInt(minimumAge);

        const amountErrorCondition = amount < 0.01 || amount > 10000;
        const descriptionErrorCondition = description.length > 140;
        const minimumAgeErrorCondition =
            setMinimumAge === true &&
            (minimumAgeInt < 12 || minimumAgeInt > 100);
        const redurectUrlErrorCondition =
            setRedirectUrl === true && redirectUrl.length < 5;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "EMAIL":
                targetErrorCondition = !EmailValidator.validate(target);
                break;
            case "PHONE":
                targetErrorCondition = target.length < 5 || target.length > 64;
                break;
            default:
        }

        this.setState({
            amountError: amountErrorCondition,
            minimumAgeError: minimumAgeErrorCondition,
            redurectUrlError: redurectUrlErrorCondition,
            descriptionError: descriptionErrorCondition,
            targetError: targetErrorCondition,
            validForm:
                !amountErrorCondition &&
                !minimumAgeErrorCondition &&
                !redurectUrlErrorCondition &&
                !descriptionErrorCondition &&
                !targetErrorCondition
        });
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
            target,
            setMinimumAge,
            minimumAge,
            setRedirectUrl,
            redirectUrl,
            allowBunqMe,
            targetType
        } = this.state;
        const minimumAgeInt = parseInt(minimumAge);
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
            default:
                this.props.openSnackbar("We failed to send this payment");
                return;
        }

        const amountInfo = {
            value: amount + "", // sigh
            currency: "EUR"
        };

        let options = {
            allow_bunqme: allowBunqMe,
            minimum_age: setMinimumAge ? minimumAgeInt : false,
            redirect_url: setRedirectUrl ? redirectUrl : false
        };

        this.props.requestInquirySend(
            userId,
            account.id,
            description,
            amountInfo,
            targetInfo,
            options
        );
    };

    render() {
        const {
            selectedAccount,
            description,
            targetType,
            allowBunqMe,
            amount,
            target
        } = this.state;
        if (!this.props.accounts[selectedAccount]) {
            return null;
        }
        const account = this.props.accounts[selectedAccount]
            .MonetaryAccountBank;

        let targetContent = null;
        switch (this.state.targetType) {
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
        }

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <Typography type="headline">Request Payment</Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChange("selectedAccount")}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        <TargetSelection
                            targetType={this.state.targetType}
                            setTargetType={this.setTargetType}
                        />

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

                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    checked={this.state.expandedCollapse}
                                    onClick={this.toggleExpanded}
                                />
                            }
                            label="Advanced options"
                        />

                        <Collapse
                            in={this.state.expandedCollapse}
                            unmountOnExit
                        >
                            <MinimumAge
                                targetType={this.state.targetType}
                                minimumAge={this.state.minimumAge}
                                setMinimumAge={this.state.setMinimumAge}
                                minimumAgeError={this.state.minimumAgeError}
                                handleToggle={this.handleToggle(
                                    "setMinimumAge"
                                )}
                                handleChange={this.handleChange("minimumAge")}
                            />

                            <RedirectUrl
                                targetType={this.state.targetType}
                                redirectUrl={this.state.redirectUrl}
                                setRedirectUrl={this.state.setRedirectUrl}
                                redirectUrlError={this.state.redirectUrlError}
                                handleToggle={this.handleToggle(
                                    "setRedirectUrl"
                                )}
                                handleChange={this.handleChange("redirectUrl")}
                            />

                            <AllowBunqMe
                                targetType={this.state.targetType}
                                allowBunqMe={this.state.allowBunqMe}
                                handleToggle={this.handleToggle("allowBunqMe")}
                            />
                        </Collapse>

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
                    </Paper>

                    <ConfirmationDialog
                        closeModal={this.closeModal}
                        sendInquiry={this.sendInquiry}
                        confirmModalOpen={this.state.confirmModalOpen}
                        description={description}
                        targetType={targetType}
                        allowBunqMe={allowBunqMe}
                        account={account}
                        amount={amount}
                        target={target}
                    />
                </Grid>
            </Grid>
        );
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
        requestInquirySend: (
            userId,
            accountId,
            description,
            amount,
            target,
            options
        ) =>
            dispatch(
                requestInquirySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    description,
                    amount,
                    target,
                    options
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestInquiry);
