import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import EmailValidator from "email-validator";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import TargetSelection from "../../Components/FormFields/TargetSelection";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import RedirectUrl from "../../Components/FormFields/RedirectUrl";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import ButtonTranslate from "../../Components/TranslationHelpers/Button";
import ConfirmationDialog from "./ConfirmationDialog";

import SplitAmountForm from "./SplitAmountForm";
import MinimumAge from "./Options/MinimumAge";
import AllowBunqMe from "./Options/AllowBunqMe";

import { openSnackbar } from "../../Actions/snackbar";
import { requestInquirySend } from "../../Actions/request_inquiry";

import { getInternationalFormat, isValidPhonenumber } from "../../Helpers/PhoneLib";
import TotalSplitHelper from "./TotalSplitHelper";

const styles = {
    payButton: {
        width: "100%"
    },
    formControlAlt: {
        marginBottom: 10,
        marginTop: 10
    },
    paper: {
        padding: 24,
        marginBottom: 8,
        textAlign: "left"
    },
    titleGrid: { display: "flex", alignItems: "center" }
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

            // a list with all the targets
            targets: [],

            // split amounts for targets
            splitAmounts: {},
            splitRequest: true,

            // defines which type is used
            targetType: "CONTACT"
        };
    }

    componentDidMount() {
        if (this.props.limitedPermissions) {
            this.props.history.push("/");
            return;
        }

        const searchParams = new URLSearchParams(this.props.location.search);
        if (searchParams.has("amount")) {
            const amount = parseFloat(searchParams.get("amount"));
            this.setState({ amount: amount >= 0 ? amount : amount * -1 });
        }

        // set the current account selected on the dashboard as the active one
        this.props.accounts.map((account, accountKey) => {
            if (this.props.selectedAccount === account.id) {
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
    handleChangeDirect = name => value => {
        this.setState(
            {
                [name]: value
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
                amount: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
            },
            this.validateForm
        );
    };

    // remove a key from the target list
    removeTarget = key => {
        const newTargets = [...this.state.targets];
        if (newTargets[key]) {
            newTargets.splice(key, 1);
            this.setState(
                {
                    targets: newTargets
                },
                () => {
                    this.validateForm();
                    this.validateTargetInput();
                }
            );
        }
    };

    setSplitCount = (key, amount) => {
        const splitAmounts = this.state.splitAmounts;
        splitAmounts[key] = amount;

        this.setState({
            splitAmounts: splitAmounts
        });
    };
    toggleSplitRequest = event => {
        this.setState({
            splitRequest: !this.state.splitRequest
        });
    };

    // add a target from the current text inputs to the target list
    addTarget = () => {
        const duplicateTargetMessage = this.props.t("This target seems to be added already");
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                const currentTargets = [...this.state.targets];

                let foundDuplicate = false;
                let targetValue = this.state.target.trim();

                if (isValidPhonenumber(targetValue)) {
                    // valid phone number, we must format as international
                    targetValue = getInternationalFormat(targetValue);
                }

                // check for duplicates in existing target list
                currentTargets.map(newTarget => {
                    if (newTarget.type === this.state.targetType) {
                        if (newTarget.value === targetValue) {
                            foundDuplicate = true;
                        }
                    }
                });

                if (!foundDuplicate) {
                    currentTargets.push({
                        type: this.state.targetType,
                        value: targetValue,
                        name: ""
                    });
                } else {
                    this.props.openSnackbar(duplicateTargetMessage);
                }

                this.setState(
                    {
                        // set the new target list
                        targets: currentTargets,
                        // reset the input
                        target: ""
                    },
                    () => {
                        this.validateForm();
                        this.validateTargetInput();
                    }
                );
            }
        });
    };

    // validate only the taret inputs
    validateTargetInput = (callback = () => {}) => {
        const { target, targetType } = this.state;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
                break;
        }

        this.setState(
            {
                targetError: targetErrorCondition
            },
            () => callback(!targetErrorCondition)
        );
    };

    // validates all the possible input combinations
    validateForm = () => {
        const {
            description,
            amount,
            target,
            targets,
            setMinimumAge,
            minimumAge,
            setRedirectUrl,
            redirectUrl,
            targetType
        } = this.state;
        const minimumAgeInt = parseInt(minimumAge);

        const amountErrorCondition = amount < 0.01 || amount > 10000;
        const descriptionErrorCondition = description.length > 140;
        const minimumAgeErrorCondition = setMinimumAge === true && (minimumAgeInt < 12 || minimumAgeInt > 100);
        const redurectUrlErrorCondition = setRedirectUrl === true && redirectUrl.length < 5;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
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
                targets.length > 0
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
            targets,
            setMinimumAge,
            minimumAge,
            setRedirectUrl,
            redirectUrl,
            allowBunqMe,
            splitAmounts,
            splitRequest
        } = this.state;
        const minimumAgeInt = parseInt(minimumAge);

        // account the payment is made from
        const account = accounts[selectedAccount];
        // our user id
        const userId = user.id;

        // calculate total split count
        const totalSplit = TotalSplitHelper(targets, splitAmounts);

        const requestInquiries = [];
        targets.map(target => {
            // check if the target is valid based onthe targetType
            let targetInfo = false;
            switch (target.type) {
                case "CONTACT":
                    const validEmail = EmailValidator.validate(target.value);
                    const validPhone = isValidPhonenumber(target.value);

                    if (validEmail) {
                        targetInfo = {
                            type: "EMAIL",
                            value: target.value.trim()
                        };
                    } else if (validPhone) {
                        const formattedNumber = getInternationalFormat(target.value);
                        if (formattedNumber) {
                            targetInfo = {
                                type: "PHONE_NUMBER",
                                value: formattedNumber
                            };
                        }
                    }
                    break;
                default:
                    // invalid type
                    break;
            }

            // amount inquired for all the requestInquiries
            let amountInfo = {
                value: amount + "", // sigh, number has to be sent as a string
                currency: "EUR"
            };

            if (splitRequest) {
                // default to 1 if split is enabled
                const splitAmountValue =
                    typeof splitAmounts[target.value] !== "undefined" ? splitAmounts[target.value] : 1;

                // calculate the percentage for this split vs total
                const percentage = totalSplit > 0 ? splitAmountValue / totalSplit : 0;

                // calculate the actual amount
                const moneyAmount = amount * percentage;

                // set correct amount
                amountInfo = {
                    value: moneyAmount.toFixed(2) + "", // sigh, number has to be sent as a string
                    currency: "EUR"
                };
            }

            const requestInquiry = {
                amount_inquired: amountInfo,
                counterparty_alias: targetInfo,
                description: description,
                allow_bunqme: allowBunqMe
            };
            if (setMinimumAge) {
                requestInquiry.minimum_age = minimumAgeInt;
            }
            if (setRedirectUrl) {
                requestInquiry.redirect_url = redirectUrl;
            }

            if (targetInfo !== false) requestInquiries.push(requestInquiry);
        });

        this.props.requestInquirySend(userId, account.id, requestInquiries);
    };

    render() {
        const {
            selectedAccount,
            description,
            descriptionError,
            targetType,
            allowBunqMe,
            amount,
            target,
            targetError,
            targets,
            splitAmounts,
            splitRequest
        } = this.state;
        const t = this.props.t;
        if (!this.props.accounts[selectedAccount]) {
            return null;
        }
        const account = this.props.accounts[selectedAccount];

        const totalSplit = TotalSplitHelper(targets, splitAmounts);

        const advancedOptionsForm = (
            <Paper style={styles.paper}>
                <Grid container spacing={8}>
                    <Grid item xs={12} style={styles.titleGrid}>
                        <Switch color="primary" checked={this.state.expandedCollapse} onClick={this.toggleExpanded} />
                        <TranslateTypography variant="h6">Advanced options</TranslateTypography>
                    </Grid>
                    <Collapse in={this.state.expandedCollapse} unmountOnExit>
                        <Grid item xs={12}>
                            <MinimumAge
                                t={t}
                                targetType={this.state.targetType}
                                minimumAge={this.state.minimumAge}
                                setMinimumAge={this.state.setMinimumAge}
                                minimumAgeError={this.state.minimumAgeError}
                                handleToggle={this.handleToggle("setMinimumAge")}
                                handleChange={this.handleChange("minimumAge")}
                            />

                            <RedirectUrl
                                targetType={this.state.targetType}
                                redirectUrl={this.state.redirectUrl}
                                setRedirectUrl={this.state.setRedirectUrl}
                                redirectUrlError={this.state.redirectUrlError}
                                handleToggle={this.handleToggle("setRedirectUrl")}
                                handleChange={this.handleChange("redirectUrl")}
                            />

                            <AllowBunqMe
                                t={t}
                                targetType={this.state.targetType}
                                allowBunqMe={this.state.allowBunqMe}
                                handleToggle={this.handleToggle("allowBunqMe")}
                            />
                        </Grid>
                    </Collapse>
                </Grid>
            </Paper>
        );

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Pay")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate variant="h5">Request Payment</TypographyTranslate>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChange("selectedAccount")}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                            hiddenConnectTypes={["draftOnly", "showOnly"]}
                        />

                        <TargetSelection
                            targetType={targetType}
                            targets={targets}
                            target={target}
                            targetError={targetError}
                            validForm={this.state.validForm}
                            handleChangeDirect={this.handleChangeDirect}
                            handleChange={this.handleChange}
                            setTargetType={this.setTargetType}
                            removeTarget={this.removeTarget}
                            addTarget={this.addTarget}
                            disabledTypes={["IBAN", "TRANSFER"]}
                        />

                        <TextField
                            fullWidth
                            error={descriptionError}
                            id="description"
                            label={t("Description")}
                            value={description}
                            onChange={this.handleChange("description")}
                            multiline={true}
                        />

                        <FormControl style={styles.formControlAlt} error={this.state.amountError} fullWidth>
                            <MoneyFormatInput
                                id="amount"
                                value={this.state.amount}
                                onValueChange={this.handleChangeFormatted}
                                onKeyPress={ev => {
                                    if (ev.key === "Enter" && this.state.validForm) {
                                        this.openModal();
                                        ev.preventDefault();
                                    }
                                }}
                            />
                        </FormControl>
                    </Paper>

                    <SplitAmountForm
                        t={t}
                        BunqJSClient={this.props.BunqJSClient}
                        account={account}
                        targets={this.state.targets}
                        amount={this.state.amount}
                        splitAmounts={this.state.splitAmounts}
                        setSplitCount={this.setSplitCount}
                        splitRequest={this.state.splitRequest}
                        toggleSplitRequest={this.toggleSplitRequest}
                    />

                    {advancedOptionsForm}

                    <Paper style={styles.paper}>
                        <ButtonTranslate
                            variant="contained"
                            color="primary"
                            disabled={
                                !this.state.validForm ||
                                (this.props.requestInquiryLoading || (totalSplit <= 0 && splitRequest === true))
                            }
                            style={styles.payButton}
                            onClick={this.openModal}
                        >
                            Send request
                        </ButtonTranslate>
                    </Paper>

                    <ConfirmationDialog
                        t={t}
                        closeModal={this.closeModal}
                        sendInquiry={this.sendInquiry}
                        confirmModalOpen={this.state.confirmModalOpen}
                        description={description}
                        targetType={targetType}
                        allowBunqMe={allowBunqMe}
                        account={account}
                        amount={amount}
                        targets={targets}
                        totalSplit={totalSplit}
                        splitAmounts={splitAmounts}
                        splitRequest={splitRequest}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        requestInquiryLoading: state.request_inquiry.loading,

        selectedAccount: state.accounts.selected_account,
        accounts: state.accounts.accounts,

        user: state.user.user,
        limitedPermissions: state.user.limited_permissions
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        requestInquirySend: (userId, accountId, requestInquiries) =>
            dispatch(requestInquirySend(BunqJSClient, userId, accountId, requestInquiries)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(RequestInquiry));
