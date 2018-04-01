import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import EmailValidator from "email-validator";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Collapse from "material-ui/transitions/Collapse";
import Switch from "material-ui/Switch";
import { FormControl, FormControlLabel } from "material-ui/Form";

import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import TargetSelection from "../../Components/FormFields/TargetSelection";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import RedirectUrl from "../../Components/FormFields/RedirectUrl";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import ButtonTranslate from "../../Components/TranslationHelpers/Button";
import ConfirmationDialog from "./ConfirmationDialog";
import MinimumAge from "./Options/MinimumAge";
import AllowBunqMe from "./Options/AllowBunqMe";

import { openSnackbar } from "../../Actions/snackbar";
import { requestInquirySend } from "../../Actions/request_inquiry";

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

            //
            targets: [],

            // defines which type is used
            targetType: "EMAIL"
        };
    }

    componentDidMount() {
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

    // add a target from the current text inputs to the target list
    addTarget = () => {
        const duplicateTargetMessage = this.props.t(
            "This target seems to be added already"
        );
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                const currentTargets = [...this.state.targets];

                let foundDuplicate = false;
                const targetValue = this.state.target.trim();

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
            case "EMAIL":
                targetErrorCondition = !EmailValidator.validate(target);
                break;
            case "PHONE":
                targetErrorCondition = target.length < 5 || target.length > 64;
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
            allowBunqMe
        } = this.state;
        const minimumAgeInt = parseInt(minimumAge);

        // account the payment is made from
        const account = accounts[selectedAccount];
        // our user id
        const userId = user.id;

        // amount inquired for all the requestInquiries
        const amountInfo = {
            value: amount + "", // sigh, number has to be sent as a string
            currency: "EUR"
        };

        const requestInquiries = [];
        targets.map(target => {
            // check if the target is valid based onthe targetType
            let targetInfo = false;
            switch (target.type) {
                case "EMAIL":
                    targetInfo = {
                        type: "EMAIL",
                        value: target.value.trim()
                    };
                    break;
                case "PHONE":
                    targetInfo = {
                        type: "PHONE_NUMBER",
                        value: target.value.trim()
                    };
                    break;
                default:
                    // invalid type
                    break;
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
            targetType,
            allowBunqMe,
            amount,
            target,
            targets
        } = this.state;
        const t = this.props.t;
        if (!this.props.accounts[selectedAccount]) {
            return null;
        }
        const account = this.props.accounts[selectedAccount];

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Pay")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate variant="headline">
                            Request Payment
                        </TypographyTranslate>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChange("selectedAccount")}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        <TargetSelection
                            targetType={this.state.targetType}
                            targets={this.state.targets}
                            target={this.state.target}
                            targetError={this.state.targetError}
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
                            error={this.state.descriptionError}
                            id="description"
                            label={t("Description")}
                            value={this.state.description}
                            onChange={this.handleChange("description")}
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
                            label={t("Advanced options")}
                        />

                        <Collapse
                            in={this.state.expandedCollapse}
                            unmountOnExit
                        >
                            <MinimumAge
                                t={t}
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
                                t={t}
                                targetType={this.state.targetType}
                                allowBunqMe={this.state.allowBunqMe}
                                handleToggle={this.handleToggle("allowBunqMe")}
                            />
                        </Collapse>

                        <ButtonTranslate
                            variant="raised"
                            color="primary"
                            disabled={
                                !this.state.validForm ||
                                this.props.requestInquiryLoading
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
                        target={target}
                        targets={targets}
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
        requestInquirySend: (userId, accountId, requestInquiries) =>
            dispatch(
                requestInquirySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    requestInquiries
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(RequestInquiry)
);
